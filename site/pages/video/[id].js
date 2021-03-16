import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import Player from "../../components/player";
import { VideoList } from "../../components/video-list";
import { getAllVideos } from "../../lib/pages";
import { isFavorite } from "../../lib/favorite";
import styles from "../../styles/Video.module.css";
import Chord from "@tombatossals/react-chords/lib/Chord";
import ukeChordsDB from "@tombatossals/chords-db/lib/ukulele";
import guitarChordsDB from "@tombatossals/chords-db/lib/guitar";
import dynamic from "next/dynamic";

const findChord = (chord, db, isBaritone) => {
  const [_, key, s] = chord.match(/([A-G]b*)(.*)/);
  let suffix;
  switch (s) {
    case "":
      suffix = "major";
      break;
    case "m":
      suffix = "minor";
      break;
    default:
      suffix = s;
      break;
  }
  const chordData = db.chords[key].find(it => it.suffix === suffix)?.positions[0];
  const { frets, fingers, barres } = chordData;
  return {
    ...chordData,
    frets: frets.slice(-4),
    fingers: isBaritone ? [] : fingers,
    barres: isBaritone ? [] : barres
  };
};

const SongInfo = ({ video }) => {
  const [showChords, setShowChords] = useState(true);
  const isBaritone = video.baritone !== 0;
  const chordsDB = isBaritone ? guitarChordsDB : ukeChordsDB;
  const {
    tunings: { standard }
  } = chordsDB;
  const instrument = {
    ...chordsDB.main,
    strings: 4,
    tunings: { standard: standard.slice(-4, 0) }
  };
  const dateStr = String(video.upload_date);
  const uploadDate = new Date(dateStr.slice(0, 4), dateStr.slice(4, 6) - 1, dateStr.slice(6, 8));

  const Favorite = dynamic(() => import("../../components/video-list").then(mod => mod.Favorite), {
    ssr: false
  });

  return (
    <>
      <ul className={styles.songInfo}>
        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Track</span>
          <span className={styles.songInfoValue}>
            {video.track}
            <div className={styles.favIcon}>
              <Favorite video={video} />
            </div>
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>
            Chords <br />
            <span>
              (Diagrams:
              <input
                checked={showChords}
                type="checkbox"
                onChange={e => setShowChords(e.target.checked)}
              />
              )
            </span>
          </span>

          <span className={styles.songInfoValue}>
            {video.chords?.map(chord => (
              <Link key={chord} href={`/?refinementList[chords][0]=${chord}`}>
                <a className={styles.chordName}>{chord}</a>
              </Link>
            ))}
            {isBaritone && video.chords?.length > 0 && (
              <small>
                * we use modified guitar chord diagrams for Baritone Ukulele, and cannot show
                correct finger numbers or barre-ing diagrams
              </small>
            )}
          </span>
        </li>

        {showChords && (
          <li className={`${styles.chordDiagrams} ${styles.songInfoEntry}`}>
            <span className={styles.songInfoValue}>
              {video.chords?.map(chord => (
                <span className={styles.chordDiagram} key={chord}>
                  <h5>{chord}</h5>
                  <Chord
                    lite={false}
                    instrument={instrument}
                    chord={findChord(chord, chordsDB, isBaritone)}
                  />
                </span>
              ))}
            </span>
          </li>
        )}

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Album</span>
          <span className={styles.songInfoValue}>
            <Link href={`/?refinementList[album][0]=${video.album}`}>
              <a>{video.album}</a>
            </Link>
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Artist(s)</span>
          <span className={styles.songInfoValue}>
            {video.artists?.map(artist => (
              <Link key={artist} href={`/?refinementList[artists][0]=${artist}`}>
                <a className={styles.chordName}>{artist}</a>
              </Link>
            ))}
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Composer(s)</span>
          <span className={styles.songInfoValue}>{video.composer}</span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Language</span>
          <span className={styles.songInfoValue}>
            <Link href={`/?refinementList[language][0]=${video.language}`}>
              <a className={styles.chordName}>{video.language}</a>
            </Link>
          </span>
        </li>
      </ul>

      <p>
        This video was uploaded by{" "}
        <Link href={`/?refinementList[uploader][0]=${video.uploader}`}>
          <a>{video.uploader}</a>
        </Link>{" "}
        on {uploadDate.toLocaleDateString()}. Support{" "}
        <Link href={`https://youtube.com/channel/${video.channel}?sub_confirmation=1`}>
          <a>this channel</a>
        </Link>{" "}
        by subscribing and liking the{" "}
        <Link href={`https://youtube.com/v/${video.id}`}>
          <a title={video.title}>video on YouTube</a>
        </Link>
        .
      </p>
    </>
  );
};

export default function Video({ video, videos }) {
  const favorite = isFavorite(video.id);
  video.favorite = favorite;
  const otherIds = video.id_related
    ? video.id_related.split(",").filter(it => it !== video.id)
    : [];
  const otherVersions = otherIds.map(it => videos.find(v => v.id === it));

  return (
    <Layout>
      <Head>
        <title>
          {video.uploader}: {video.track} - {video.artists.join(", ")} - Ukulele Video Tutorial
        </title>
        <meta
          name="description"
          content={`Ukulele video tutorial for the song ${video.track} from the channel ${
            video.uploader
          }. Artists: ${video.artists.join(", ")}. Chords: ${video.chords.join(", ")}.`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.panelContainer}>
        <div className={styles.leftPanel}>
          <SongInfo video={video} />
        </div>
        <div className={styles.centerPanel}>
          <Player
            url={`https://youtube.com/v/${video.id}`}
            start={video.loop_start}
            end={video.loop_end}
          />
        </div>
        <div className={styles.rightPanel}>
          {video.id_related && (
            <div>
              <h2>Other Versions</h2>
              <VideoList videos={otherVersions} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const videos = await getAllVideos();
  const paths = videos.map(({ id }) => ({ params: { id } }));
  return {
    paths: paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const videos = await getAllVideos();
  const video = videos.find(v => v.id === id) || null;
  return { props: { video, videos } };
}
