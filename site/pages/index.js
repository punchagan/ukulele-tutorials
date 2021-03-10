import {useState} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import {Video} from '../components/video-list'
import {getAllVideos} from '../lib/pages'
import {createSearchClient} from '../lib/search'
import styles from '../styles/Home.module.css'
import {
  InstantSearch,
  SearchBox,
  Hits,
  ClearRefinements,
  RefinementList,
  Configure,
  Pagination
} from 'react-instantsearch-dom';

// Include only the reset
import 'instantsearch.css/themes/reset.css';
// or include the full Satellite theme
import 'instantsearch.css/themes/satellite.css';


export default function Home({ videos }) {
  const [videoList, setVideoList] = useState(videos)

  return (
    <Layout>
      <main className={styles.main}>
        <InstantSearch searchClient={createSearchClient(videos)}
                       indexName="videos"
                       >
          <div className="left-panel">
            <SearchBox />
            <ClearRefinements />
            <h2>Artists</h2>
            <RefinementList attribute="artists"
                            limit={15} showMore={true} showMoreLimit={1000}
                            searchable={true} />
            <Configure hitsPerPage={20} />
          </div>
          <Hits hitComponent={Video}/>
          <div className="pagination">
            <Pagination />
          </div>
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
