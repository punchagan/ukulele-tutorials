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

import 'instantsearch.css/themes/reset.css';
import 'instantsearch.css/themes/satellite.css';


export default function Home({ videos }) {
  const [videoList, setVideoList] = useState(videos)

  return (
    <Layout>
        <InstantSearch searchClient={createSearchClient(videos)}
                       indexName="videos">
          <div className={styles.searchPanel}>
            <div className={styles.searchPanelFilters}>
              <ClearRefinements />
              <h3>Artists</h3>
              <RefinementList attribute="artists"
                              limit={10} showMore={true} showMoreLimit={1000}
                              searchable={true} />
              <h3>Album</h3>
              <RefinementList attribute="album"
                              limit={10} showMore={true} showMoreLimit={1000}
                              searchable={true} />
              <h3>Channel</h3>
              <RefinementList attribute="uploader"
                              limit={10} showMore={true} showMoreLimit={100}
                              />
              <Configure hitsPerPage={20} />
            </div>

            <div className={styles.searchPanelResults}>
              <SearchBox
                className={styles.tutorialSearch}
                translations={{placeholder: 'Search your tutorial here...'}} />
              <Hits className={styles.tutorialItems} hitComponent={Video}/>
              <div className="pagination">
                <Pagination showLast={true} />
              </div>
            </div>

          </div>
        </InstantSearch>
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
