import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import Player from "../../components/player";
import { VideoList } from "../../components/video-list";
import { getAllVideos } from "../../lib/pages";
import styles from "../../styles/Video.module.css";
import Chord from "@tombatossals/react-chords/lib/Chord";
import ukeChordsDB from "@tombatossals/chords-db/lib/ukulele";

const findChord = chord => {
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
  const chordData = ukeChordsDB.chords[key].find(it => it.suffix === suffix);
  return chordData?.positions[0];
};

export default function Video({ video, videos }) {
  const otherIds = video.id_related
    ? video.id_related.split(",").filter(it => it !== video.id)
    : [];
  const otherVersions = otherIds.map(it => videos.find(v => v.id === it));
  const instrument = { ...ukeChordsDB.main, tunings: ukeChordsDB.tunings };
  const [showChords, setShowChords] = useState(true);

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
          <ul className={styles.songInfo}>
            <li className={styles.songInfoEntry}>
              <span className={styles.songInfoKey}>
                Chords <br />
                (Diagrams:
                <input
                  checked={showChords}
                  type="checkbox"
                  onChange={e => setShowChords(e.target.checked)}
                />
                )
              </span>
              <span className={styles.songInfoValue}>
                {video.chords?.map(chord => (
                  <Link href={`/?refinementList[chords][0]=${chord}`}>
                    <a className={styles.chordName}>{chord}</a>
                  </Link>
                ))}
              </span>
            </li>

            <li className={`${styles.chordDiagrams} ${styles.songInfoEntry}`}>
              <span className={styles.songInfoValue}>
                {showChords &&
                  video.chords?.map(chord => (
                    <span className={styles.chordDiagram} key={chord}>
                      <h5>{chord}</h5>
                      <Chord lite={false} instrument={instrument} chord={findChord(chord)} />
                    </span>
                  ))}
              </span>
            </li>

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
                  <Link href={`/?refinementList[artists][0]=${artist}`}>
                    <a className={styles.chordName}>{artist}</a>
                  </Link>
                ))}
              </span>
            </li>

            <li className={styles.songInfoEntry}>
              <span className={styles.songInfoKey}>Composer(s)</span>
              <span className={styles.songInfoValue}>{video.composer}</span>
            </li>
          </ul>

          <p>
            This video was uploaded by{" "}
            <Link href={`/?refinementList[uploader][0]=${video.uploader}`}>
              <a>{video.uploader}</a>
            </Link>
            . Support{" "}
            <Link href={`https://youtube.com/channel/${video.channel}?sub_confirmation=1`}>
              <a>this channel</a>
            </Link>{" "}
            by subscribing and liking the{" "}
            <Link href={`https://youtube.com/v/${video.id}`}>
              <a>video on YouTube</a>
            </Link>
            .
          </p>
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
