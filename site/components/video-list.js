import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { toggleFavorite } from "../lib/favorite";
import { markIgnored } from "../lib/api";
import { Card } from "antd";
import {
  CloseOutlined,
  HeartFilled,
  HeartOutlined,
  PlayCircleOutlined,
  YoutubeFilled,
} from "@ant-design/icons";

const { Meta } = Card;

export function Favorite({ video }) {
  const [fav, setFav] = useState(Boolean(video.favorite));
  const favClass = fav ? styles.favoriteVideo : styles.notFavoriteVideo;
  const Icon = fav ? HeartFilled : HeartOutlined;
  const title = fav ? "Remove from Favorites" : "Add to Favorites";

  const clickFavorite = (e) => {
    setFav(!fav);
    toggleFavorite(video.id, !fav);
  };

  return (
    <span onClick={clickFavorite} className={`${styles.changeFavorite} ${favClass}`}>
      <Icon title={title} />
    </span>
  );
}

export function Video({ hit: video }) {
  const title = video.track || video.title;
  const actions = [
    <Link href={`/video/${video.id}`}>
      <a title="Watch Tutorial">
        <PlayCircleOutlined />
      </a>
    </Link>,

    <Favorite video={video} />,
    <a
      className={styles.externalLink}
      title="Watch on YouTube"
      href={`https://youtube.com/v/${video.id}`}
    >
      <YoutubeFilled />
    </a>,
  ];

  if (!video.publish) {
    actions.push(<CloseOutlined onClick={() => markIgnored(video.id)} title="Mark as Ignored" />);
  }

  return (
    <Card
      size="small"
      className={styles.videoCard}
      cover={<img alt={video.title} src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} />}
      actions={actions}
    >
      <Meta
        title={
          <Link href={`/video/${video.id}`}>
            <a title="Watch Tutorial">{title}</a>
          </Link>
        }
        description={video.artists.join(", ") || "..."}
      />
    </Card>
  );
}

export function VideoList({ videos }) {
  return (
    <div>
      {videos.map((video) => (
        <Video key={video.id} hit={video} />
      ))}
    </div>
  );
}
