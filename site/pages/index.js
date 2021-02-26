import { promises as fs } from 'fs'
import path from 'path'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home({ videos }) {
  console.log(videos)
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
            <a href={`https://youtube.com/v/${video.id}`} className={styles.card}>
              <h3>{video.track}</h3>
              <img className={styles.thumbnail} src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} />
            </a>
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
  const publishedJson = path.join(process.cwd(), '..', 'data', 'published.json')
  const content = await fs.readFile(publishedJson, 'utf8')
  const videos = JSON.parse(content)
  return {
    props: {
      videos: await Promise.all(videos),
    },
  }
}
