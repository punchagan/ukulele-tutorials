import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import VideoList from '../components/video-list'
import {getAllVideos} from '../lib/pages'
import styles from '../styles/Home.module.css'

export default function Home({ videos }) {
  const sortedVideos = videos.sort(
    (a, b) =>String(b.upload_date).localeCompare(String(a.upload_date))
  )
  return (
    <Layout>
      <main className={styles.main}>
        <p className={styles.description}>
          Get started by choosing a tutorial below
        </p>

        <VideoList videos={sortedVideos} />

      </main>
    </Layout>
  )
}


export async function getStaticProps() {
  const videos = await getAllVideos()
  return {
    props: {
      videos
    },
  }
}
