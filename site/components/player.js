import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import styles from "../styles/Video.module.css";

export default function Player({ url, start, end, onChange }) {
  const player = useRef(null);
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [useLoop, setUseLoop] = useState(true);

  const playFromStart = () => {
    if (!useLoop) {
      return;
    }
    player.current.seekTo(start, "seconds");
    setPlaying(true);
  };

  const progressCallback = data => {
    if (useLoop && (data.playedSeconds >= end || data.playedSeconds < start)) {
      playFromStart();
    }
  };

  return (
    <div>
      <div className={styles.reactWrapper}>
        <ReactPlayer
          className={styles.playerWrapper}
          url={url}
          light={false}
          controls={true}
          playing={playing}
          ref={player}
          width="100%"
          progressInterval={100}
          onProgress={progressCallback}
          onEnded={playFromStart}
          config={{
            youtube: {
              playerVars: {
                color: "white",
                modestbranding: 1,
                rel: 0,
                showinfo: 0
              }
            }
          }}
        />
      </div>

      <ul className={styles.videoLoopControls}>
        <li className={styles.loopControl}>
          <span>Loop </span>
          <span>
            <input
              type="checkbox"
              defaultChecked={useLoop}
              onChange={e => setUseLoop(e.target.checked)}
            />
          </span>
        </li>
        <li className={styles.loopControl}>
          <span>Start </span>
          <span>
            <input
              name="loop_start"
              type="number"
              step="0.01"
              min="0"
              defaultValue={start}
              onChange={onChange}
            />
          </span>
        </li>
        <li className={styles.loopControl}>
          <span>End </span>
          <span>
            <input
              name="loop_end"
              type="number"
              step="0.01"
              min="0"
              value={end}
              onChange={onChange}
            />
          </span>
        </li>
      </ul>
    </div>
  );
}
