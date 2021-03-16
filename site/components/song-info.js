import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ukeChordsDB from "@tombatossals/chords-db/lib/ukulele";
import guitarChordsDB from "@tombatossals/chords-db/lib/guitar";
import Chord from "@tombatossals/react-chords/lib/Chord";
import styles from "../styles/Video.module.css";

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

export const SongInfo = ({ video }) => {
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

  const Favorite = dynamic(() => import("./video-list").then(mod => mod.Favorite), {
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
