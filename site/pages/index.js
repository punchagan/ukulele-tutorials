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
  Pagination,
  ToggleRefinement,
  NumericMenu,
} from 'react-instantsearch-dom';

import 'instantsearch.css/themes/reset.css';
import 'instantsearch.css/themes/satellite.css';


export default function Home({ videos }) {
  const [videoList, setVideoList] = useState(videos)
  const includeUnpublished = process.env.NODE_ENV !== 'production'

  return (
    <Layout>
        <InstantSearch searchClient={createSearchClient(videos)}
                       indexName="videos">
          <div className={styles.searchPanel}>
            <div className={styles.searchPanelFilters}>
              <ClearRefinements />

              {includeUnpublished &&
                <ToggleRefinement attribute="publish" defaultRefinement={true}
                                  label="only published" value={1} />
              }

              <h3>Chords</h3>
              <RefinementList className={styles.searchChords}
                              attribute="chords" limit={100} />
              <h4>Chord Count</h4>
              <NumericMenu
                attribute="chordCount"
                items={[
                  { label: '1 or 2 chords', end: 2 },
                  { label: '3 or 4 chords', start: 3, end: 4 },
                  { label: '5, 6 or 7 chords', start: 5, end: 7 },
                  { label: '8 or more chords', start: 8 },
                ]}
              />
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
                              limit={10} showMore={true} showMoreLimit={100} />

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
