import {useState} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import VideoList from '../components/video-list'
import {getAllVideos} from '../lib/pages'
import {filterVideos} from '../lib/search'
import styles from '../styles/Home.module.css'

export default function Home({ videos }) {
  const [videoList, setVideoList] = useState(videos)
  return (
    <Layout>
      <main className={styles.main}>
        <input placeholder="Search..." type="text"
               onChange={(e) => setVideoList(filterVideos(videos, e.target.value))} />
        <p className={styles.description}>
          or get started by choosing a tutorial below
        </p>
        <VideoList videos={videoList} />
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
