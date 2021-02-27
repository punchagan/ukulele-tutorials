import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {getAllVideos} from '../lib/pages'

export default function Home({ videos }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ukulele Tutorials for Indian Music</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
              <img className={styles.thumbnail} src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} />
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
      <p>&ldquo;Somebody on the Internet thinks what you do is stupid or evil or it's all been done before? Make good art. &hellip; Do what only you do best. Make good art.&rdquo;  &mdash; Neil Gaiman</p>
      </footer>
    </div>
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
