import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import styles from "../styles/Video.module.css";
import { Button, Descriptions, Modal, Slider, Switch } from "antd";
import { useHotkeys } from "react-hotkeys-hook";

export default function Player({ url, start, end, onChange }) {
  const player = useRef(null);
  const slider = useRef(null);
  const [loop, setLoop] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [useLoop, setUseLoop] = useState(true);
  const [showLoopInfo, setShowLoopInfo] = useState(false);
  const [duration, setDuration] = useState(100);
  const [showHelp, setShowHelp] = useState(false);

  const sliderChange = r => {
    onChange({ target: { name: "loop", value: r } });
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

  // Hot-keys
  useHotkeys("i", () => {
    const [_, E] = slider.current.props.value;
    const s = player.current.getCurrentTime();
    sliderChange([s, E]);
  });
  useHotkeys("o", () => {
    const [S, _] = slider.current.props.value;
    const e = player.current.getCurrentTime();
    sliderChange([S, e]);
  });
  useHotkeys(",", () => {
    const [s, e] = slider.current.props.value;
    sliderChange([Math.max(0, s - 0.1), e]);
  });
  useHotkeys(".", () => {
    const [s, e] = slider.current.props.value;
    sliderChange([Math.max(0, s + 0.1), e]);
  });
  useHotkeys("shift+,", () => {
    const [s, e] = slider.current.props.value;
    sliderChange([s, Math.min(duration, e - 0.1)]);
  });
  useHotkeys("shift+.", () => {
    const [s, e] = slider.current.props.value;
    sliderChange([s, Math.min(duration, e + 0.1)]);
  });
  useHotkeys("shift+/", () => setShowHelp(!showHelp));

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
          ref={slider}
          value={[start, end]}
          max={duration}
          step={0.1}
          range={true}
          tipFormatter={formatSeconds}
          tooltipPlacement="bottom"
          tooltipVisible={showLoopInfo}
          onChange={sliderChange}
        />

        <Modal
          title="Keyboard Shortcuts"
          visible={showHelp}
          footer={null}
          onCancel={() => setShowHelp(!showHelp)}
        >
          <Descriptions column={1}>
            <Descriptions.Item label={<pre>i</pre>}>
              Set loop start to current playing time
            </Descriptions.Item>
            <Descriptions.Item label={<pre>o</pre>}>
              Set loop end to current playing time
            </Descriptions.Item>
            <Descriptions.Item label={<pre>,</pre>}>Decrement loop start by 0.1s</Descriptions.Item>
            <Descriptions.Item label={<pre>.</pre>}>Increment loop start by 0.1s</Descriptions.Item>
            <Descriptions.Item label={<pre>&lt;</pre>}>
              Decrement loop end by 0.1s
            </Descriptions.Item>
            <Descriptions.Item label={<pre>&gt;</pre>}>
              Increment loop end by 0.1s
            </Descriptions.Item>
            <Descriptions.Item label={<pre>?</pre>}>Show this help</Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>
    </div>
  );
}
