import {useState} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import {Video} from '../components/video-list'
import {getAllVideos} from '../lib/pages'
import {createSearchClient} from '../lib/search'
import styles from '../styles/Home.module.css'
import { InstantSearch,
         SearchBox,
         Hits,
         ClearRefinements,
         RefinementList,
         Configure }
from 'react-instantsearch-dom';


export default function Home({ videos }) {
  const [videoList, setVideoList] = useState(videos)

  return (
    <Layout>
      <main className={styles.main}>
        <InstantSearch searchClient={createSearchClient(videos)}
                       indexName="videos"
                       >
          <SearchBox />
          <Hits hitComponent={Video}/>
        </InstantSearch>
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
