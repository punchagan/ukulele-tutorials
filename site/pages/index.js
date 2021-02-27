import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
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

        <div className={styles.grid}>
          {videos.map((video) => (
            <div className={styles.card} key={video.id}>
              <Link href={`/video/${video.id}`}>
                <h3>{video.track}</h3>
              </Link>
              <img className={styles.thumbnail} src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} ></img>
            </div>))}
    </div>
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
