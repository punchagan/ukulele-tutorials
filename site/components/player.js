import { useState, useRef } from "react";
import ReactPlayer from "react-player";

export default function Player({ url, start, end }) {
  const player = useRef(null);
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loopStart, setLoopStart] = useState(start);
  const [loopEnd, setLoopEnd] = useState(end);
  const [useLoop, setUseLoop] = useState(true);

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
      <ReactPlayer
        url={url}
        light={false}
        controls={true}
        playing={playing}
        ref={player}
        width="800px"
        height="450px"
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
      <p>
        <input
          type="checkbox"
          defaultChecked={useLoop}
          onChange={e => setUseLoop(e.target.checked)}
        />
        Loop
      </p>
      <input
        type="number"
        step="0.01"
        min="0"
        value={loopStart}
        onChange={e => setLoopStart(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        min="0"
        value={loopEnd}
        onChange={e => setLoopEnd(e.target.value)}
      />
    </div>
  );
}
