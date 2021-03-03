import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import VideoList from '../components/video-list'
import {getAllVideos} from '../lib/pages'
import styles from '../styles/Home.module.css'

export default function Home({ videos }) {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to uke-tutorials.in!
        </h1>

        <p className={styles.description}>
          Get started by choosing a tutorial below
        </p>

        <VideoList videos={videos} />

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
