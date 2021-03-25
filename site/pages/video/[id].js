import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import Player from "../../components/player";
import { VideoList } from "../../components/video-list";
import { SongInfo } from "../../components/song-info";
import { getAllVideos } from "../../lib/pages";
import { isFavorite } from "../../lib/favorite";
import styles from "../../styles/Video.module.css";

export default function Video({ video, videos }) {
  const devEnv = process.env.NODE_ENV !== "production";

  const favorite = isFavorite(video.id);
  video.favorite = favorite;
  const otherIds = video.id_related
    ? video.id_related.split(",").filter(it => it !== video.id)
    : [];
  const otherVersions = otherIds.map(it => videos.find(v => v.id === it));

  const [form, setForm] = useState(video);
  useEffect(() => setForm(video), [video]);
  const onChange = e => {
    const name = e.target.name;
    const listAttributes = ["artists", "chords", "composer"];
    const value =
      listAttributes.indexOf(name) > -1
        ? e.target.value.replace(", ", ",").split(",")
        : e.target.value;
    setForm({ ...form, [name]: value });
  };

  return (
    <Layout>
      <Head>
        <title>
          {video.uploader}: {video.track} - {video.artists.join(", ")} - Ukulele Video Tutorial
        </title>
        <meta
          name="description"
          content={`Ukulele video tutorial for the song ${video.track} from the channel ${
            video.uploader
          }. Artists: ${video.artists.join(", ")}. Chords: ${video.chords.join(", ")}.`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.panelContainer}>
        <div className={styles.leftPanel}>
          <SongInfo video={form} onChange={onChange} devEnv={devEnv} />
        </div>
        <div className={styles.centerPanel}>
          <Player
            url={`https://youtube.com/v/${video.id}`}
            start={form.loop_start}
            end={form.loop_end}
            onChange={onChange}
          />
        </div>
        <div className={styles.rightPanel}>
          {video.id_related && (
            <div>
              <h2>Other Versions</h2>
              <VideoList videos={otherVersions} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const videos = await getAllVideos();
  const paths = videos.map(({ id }) => ({ params: { id } }));
  return {
    paths: paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const videos = await getAllVideos();
  const video = videos.find(v => v.id === id) || null;
  return { props: { video, videos } };
}
