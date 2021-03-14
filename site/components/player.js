import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import styles from "../styles/Video.module.css";

export default function Player({ url, start, end }) {
  const player = useRef(null);
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loopStart, setLoopStart] = useState(start);
  const [loopEnd, setLoopEnd] = useState(end);
  const [useLoop, setUseLoop] = useState(true);

  useEffect(() => {
    setLoopStart(start);
    setLoopEnd(end);
  }, [start, end]);

  const playFromStart = () => {
    player.current.seekTo(loopStart, "seconds");
    setPlaying(true);
  };

  const progressCallback = data => {
    if (useLoop && (data.playedSeconds >= loopEnd || data.playedSeconds < loopStart)) {
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
              type="number"
              step="0.01"
              min="0"
              value={loopStart}
              onChange={e => setLoopStart(e.target.value)}
            />
          </span>
        </li>
        <li className={styles.loopControl}>
          <span>End </span>
          <span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={loopEnd}
              onChange={e => setLoopEnd(e.target.value)}
            />
          </span>
        </li>
      </ul>
    </div>
  );
}
