import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import styles from "../styles/Video.module.css";
import { Button, Descriptions, Slider, Switch } from "antd";

export default function Player({ url, start, end, onChange }) {
  const player = useRef(null);
  const [loop, setLoop] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [useLoop, setUseLoop] = useState(true);
  const [showLoopInfo, setShowLoopInfo] = useState(false);
  const [duration, setDuration] = useState(100);

  const sliderChange = r => {
    const [rStart, rEnd] = r;
    let e;
    if (start === rStart) {
      e = { target: { name: "loop_end", value: rEnd } };
    } else {
      e = { target: { name: "loop_start", value: rStart } };
    }
    onChange(e);
  };

  const durationCallback = d => {
    setDuration(d);
    setShowLoopInfo(true);
  };

  const playFromStart = () => {
    if (!useLoop) {
      return;
    }
    player.current.seekTo(start, "seconds");
    setPlaying(true);
  };

  const progressCallback = data => {
    setCurrentTime(data.playedSeconds);
    if (useLoop && (data.playedSeconds >= end || data.playedSeconds < start)) {
      playFromStart();
    }
  };

  const testLoop = () => {
    player.current.seekTo(end - 3, "seconds");
    setPlaying(true);
    player.current.getInternalPlayer().playVideo();
  };

  const formatSeconds = value =>
    `${Math.floor(value / 60)}m ${Math.floor((value % 60) * 100) / 100}s`;

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
          progressInterval={50}
          onDuration={durationCallback}
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

      <div>
        <Switch
          size="small"
          checkedChildren="loop"
          defaultChecked={useLoop}
          onChange={e => setUseLoop(e)}
        />
        <Button style={{ float: "right" }} type="dashed" size="small" onClick={testLoop}>
          Test Loop
        </Button>
        <Descriptions>
          <Descriptions.Item label="Played Seconds">{formatSeconds(currentTime)}</Descriptions.Item>
        </Descriptions>
        <Slider
          value={[start, end]}
          max={duration}
          step={0.1}
          range={true}
          tipFormatter={formatSeconds}
          tooltipPlacement="bottom"
          tooltipVisible={showLoopInfo}
          onChange={sliderChange}
        />
      </div>
    </div>
  );
}
