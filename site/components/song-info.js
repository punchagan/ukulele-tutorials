import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ukeChordsDB from "@tombatossals/chords-db/lib/ukulele";
import guitarChordsDB from "@tombatossals/chords-db/lib/guitar";
import Chord from "@tombatossals/react-chords/lib/Chord";
import { postData, getVideoMetadata, ytSearchDescription } from "../lib/api";
import { AutoComplete, Button, Input, Select } from "antd";

import "antd/dist/antd.css";
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

const ShowSongInfo = ({ video }) => {
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
          <span className={styles.songInfoValue}>
            {video.composers?.map(composer => <span class={styles.chordName}>{composer}</span>)}
          </span>
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

const EditSongInfo = ({ video, videos, onChange }) => {
  const [error, setError] = useState();
  const publishData = () => {
    postData(video.id, { ...video, publish: 1 })
      .catch(err => setError(err.message))
      .then(data => setError(""));
  };

  const [meta, setMeta] = useState();
  const [original, setOriginal] = useState({});
  useEffect(() => {
    getVideoMetadata(video).then(data => setMeta(data));
    setOriginal({ ...original, q: `${video.track} ${video.album} original` });
  }, [video]);

  const search = e => {
    ytSearchDescription(original.q).then(data => setOriginal(data));
  };

  const artists = Array.from(new Set(videos.map(v => v.artists).flat())).sort();
  const composers = Array.from(new Set(videos.map(v => v.composers).flat())).sort();
  const albums = Array.from(new Set(videos.map(v => v.album).flat())).sort();
  const languages = Array.from(new Set(videos.map(v => v.language).flat())).sort();
  const tracks = Array.from(new Set(videos.map(v => v.track).flat())).sort();
  // FIXME: Generate chords using all the available values from chords-db
  const chords = Array.from(new Set(videos.map(v => v.chords).flat())).sort();

  return (
    <>
      <ul className={styles.songInfo}>
        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Track</span>
          <span className={styles.songInfoValue}>
            <AutoComplete
              allowClear
              style={{ width: "100%" }}
              placeholder="Please enter track title"
              defaultValue={video.track}
              filterOption={(value, option) =>
                option.value.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1
              }
              onChange={value => onChange({ target: { name: "track", value } })}
            >
              {tracks.map(a => (
                <AutoComplete.Option key={a}>{a}</AutoComplete.Option>
              ))}
            </AutoComplete>
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Chords</span>
          <span className={styles.songInfoValue}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select the chords"
              defaultValue={video.chords}
              onChange={value => onChange({ target: { name: "chords", value } })}
            >
              {chords.map(a => (
                <Select.Option key={a}>{a}</Select.Option>
              ))}
            </Select>
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Album</span>
          <span className={styles.songInfoValue}>
            <AutoComplete
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select album"
              defaultValue={video.album}
              filterOption={(value, option) =>
                option.value.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1
              }
              onChange={value => onChange({ target: { name: "album", value } })}
            >
              {albums.map(a => (
                <AutoComplete.Option key={a}>{a}</AutoComplete.Option>
              ))}
            </AutoComplete>
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Artist(s)</span>
          <span className={styles.songInfoValue}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select artist(s)"
              defaultValue={video.artists}
              onChange={value => onChange({ target: { name: "artists", value } })}
            >
              {artists.map(a => (
                <Select.Option key={a}>{a}</Select.Option>
              ))}
            </Select>
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Composer(s)</span>
          <span className={styles.songInfoValue}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select composer(s)"
              defaultValue={video.composers}
              onChange={value => onChange({ target: { name: "composers", value } })}
            >
              {composers.map(a => (
                <Select.Option key={a}>{a}</Select.Option>
              ))}
            </Select>
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoKey}>Language</span>
          <span className={styles.songInfoValue}>
            <AutoComplete
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select language"
              defaultValue={video.language}
              filterOption={(value, option) =>
                option.value.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1
              }
              onChange={value => onChange({ target: { name: "language", value } })}
            >
              {languages.map(a => (
                <AutoComplete.Option key={a}>{a}</AutoComplete.Option>
              ))}
            </AutoComplete>
          </span>
        </li>

        <li className={styles.songInfoEntry}>
          <span className={styles.songInfoValue}>
            <Button type="primary" onClick={publishData}>
              Publish
            </Button>
            <p>{error}</p>
          </span>
        </li>
      </ul>
      <h3>Search Original Song</h3>
      <Input
        style={{ width: "60%" }}
        value={original.q}
        onChange={e => setOriginal({ ...original, q: e.target.value })}
      />
      <Button onClick={search}>Search</Button>
      {original?.id && (
        <p>
          <a href={`https://youtube.com/v/${original.id}`} target="_blank">
            {original.title}
          </a>{" "}
          - ({original.uploader})
        </p>
      )}
      {original?.description?.split("\n").map(d => <p>{d}</p>)}
      {meta?.description && <h3>Uploaded Video Description</h3>}
      {meta?.description.split("\n").map(d => <p>{d}</p>)}
    </>
  );
};

export const SongInfo = ({ video, videos, onChange, devEnv }) => {
  const [edit, setEdit] = useState(!video.publish);
  const Info = edit ? EditSongInfo : ShowSongInfo;

  return (
    <>
      <span style={{ float: "right" }} onClick={() => setEdit(!edit)}>
        {devEnv && !edit && <span>&#128393;</span>}
        {devEnv && edit && <span>&#128065;</span>}
      </span>
      <Info video={video} onChange={onChange} videos={videos} />
    </>
  );
};
