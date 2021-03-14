import Link from "next/link";
import styles from "../styles/Home.module.css";

export function Video({ hit: video }) {
  const heading = (
    <h4>
      {video.uploader}: {video.track || video.title} by {video.artists.join(", ")}
    </h4>
  );

  return (
    <div key={video.id}>
      <Link href={`/video/${video.id}`}>
        <a>{heading}</a>
      </Link>
      <img className={styles.thumbnail} src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} />
    </div>
  );
}

export function VideoList({ videos }) {
  return (
    <div>
      {videos.map(video => (
        <Video key={video.id} hit={video} />
      ))}
    </div>
  );
}
