import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { toggleFavorite } from "../lib/favorite";
import { markIgnored } from "../lib/api";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";


export function Favorite({ video }) {
  const [fav, setFav] = useState(Boolean(video.favorite));
  const favClass = fav ? styles.favoriteVideo : styles.notFavoriteVideo;
  const Icon = fav ? HeartFilled : HeartOutlined

  const clickFavorite = e => {
    setFav(!fav);
    toggleFavorite(video.id, !fav);
  };

  return (
    <span onClick={clickFavorite} className={`${styles.changeFavorite} ${favClass}`}>
      <Icon />
    </span>
  );
}

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
      <Favorite video={video} />
      {!video.publish && (
        <span onClick={() => markIgnored(video.id)} style={{ float: "right", cursor: "pointer" }}>
          &#10060;
        </span>
      )}
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
