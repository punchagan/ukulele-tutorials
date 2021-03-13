import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/layout";
import { Video } from "../components/video-list";
import { getAllVideos } from "../lib/pages";
import { createSearchClient } from "../lib/search";
import styles from "../styles/Home.module.css";
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
  connectStats,
  CurrentRefinements
} from "react-instantsearch-dom";
import qs from "qs";

import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/satellite.css";

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = (router, searchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : "";

const SearchStats = connectStats(({ processingTimeMS, nbHits, nbSortedHits, areHitsSorted }) => (
  <p>{`${nbHits.toLocaleString()} tutorials found`}</p>
));

export default function Home({ videos }) {
  const includeUnpublished = process.env.NODE_ENV !== "production";
  const chordCountMenuItems = [
    { label: "1 or 2 chords", end: 2 },
    { label: "3 or 4 chords", start: 3, end: 4 },
    { label: "5, 6 or 7 chords", start: 5, end: 7 },
    { label: "8 or more chords", start: 8 }
  ];

  const router = useRouter();

  const [searchState, setSearchState] = useState(qs.parse(router.asPath.slice(2)));
  const [debouncedSetState, setDebouncedSetState] = useState(null);
  const DEBOUNCE_TIME = 400;

  const onSearchStateChange = updatedSearchState => {
    clearTimeout(debouncedSetState);

    setDebouncedSetState(
      setTimeout(() => {
        router.push(searchStateToUrl(router, updatedSearchState));
      }, DEBOUNCE_TIME)
    );

    setSearchState(updatedSearchState);
  };

  const searchModes = [
    { value: "all", label: "Include All the selected chords" },
    { value: "any", label: "Include Any of the selected chords" },
    { value: "exact", label: "Include Exactly the selected chords" },
    { value: "none", label: "Exclude All the selected chords" }
  ];
  const [chordsSearchMode, setChordsSearchMode] = useState(searchState.chordsSearchMode || "all");
  const changeSearchMode = e => setChordsSearchMode(searchModes[e.target.selectedIndex].value);
  const chordsSearchModeClassName = `ais-MenuSelect ${styles.chordModeSelect}`;

  useEffect(() => {
    onSearchStateChange({ ...searchState, chordsSearchMode });
  }, [chordsSearchMode]);

  const searchClient = createSearchClient(videos, chordsSearchMode);

  return (
    <Layout>
      <InstantSearch
        searchClient={searchClient}
        searchState={searchState}
        createURL={createURL}
        onSearchStateChange={onSearchStateChange}
        indexName="videos"
      >
        <div className={styles.searchPanel}>
          <div className={styles.searchPanelFilters}>
            <SearchStats />
            <CurrentRefinements className={styles.currentRefinements} />
            <ClearRefinements />
            {includeUnpublished && (
              <ToggleRefinement
                attribute="publish"
                defaultRefinement={false}
                label="only published"
                value={1}
              />
            )}
            <h3>Tuning</h3>
            <RefinementList attribute="tuning" limit={2} showMore={false} />
            <h3>Chords</h3>
            <RefinementList className={styles.searchChords} attribute="chords" limit={100} />
            <h6 className={styles.modeHeading}>Search mode</h6>
            <div className={chordsSearchModeClassName}>
              <select
                className="ais-MenuSelect-select"
                onChange={changeSearchMode}
                value={chordsSearchMode}
              >
                {searchModes.map(mode => (
                  <option className="ais-MenuSelect-option" key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>
            <h4>Chord Count</h4>
            <NumericMenu attribute="chordCount" items={chordCountMenuItems} />
            <h3>Artists</h3>
            <RefinementList
              attribute="artists"
              limit={10}
              showMore={true}
              showMoreLimit={1000}
              searchable={true}
            />
            <h3>Album</h3>
            <RefinementList
              attribute="album"
              limit={10}
              showMore={true}
              showMoreLimit={1000}
              searchable={true}
            />
            <h3>Channel</h3>
            <RefinementList attribute="uploader" limit={10} showMore={true} showMoreLimit={100} />
            <Configure hitsPerPage={20} />
          </div>

          <div className={styles.searchPanelResults}>
            <SearchBox
              className={styles.tutorialSearch}
              translations={{ placeholder: "Search your tutorial here..." }}
            />
            <Hits className={styles.tutorialItems} hitComponent={Video} />
            <div className="pagination">
              <Pagination showLast={true} />
            </div>
          </div>
        </div>
      </InstantSearch>
    </Layout>
  );
}

export async function getStaticProps() {
  const videos = await getAllVideos();
  return {
    props: {
      videos
    }
  };
}
