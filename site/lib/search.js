const sortByUploadDate = (a, b) => String(b.upload_date).localeCompare(String(a.upload_date))

export const filterByQuery = (videos, query) => {
  const q = query.toLocaleLowerCase()

  return videos
    .filter((vid) => (vid.track || vid.title).toLocaleLowerCase().indexOf(q) > -1)
    .sort(sortByUploadDate)
}

export const filterByFacets = (videos, facetFilters) => {
  // FIXME: Deal with other kinds of facets too.. right now only artists
  const artistFilters = facetFilters?.[0]
  const re = new RegExp(artistFilters?.map(y => y.split(':')[1]).join("|"))
  return videos.filter((vid) => vid.artists.search(re) > -1)
}

const getArtistCounts = (data) => {
  const counts = data
        .map(v => v.artists.split(', '))
        .reduce((acc, artists) => {
          artists.forEach(artist => {
            if (artist == "") {
              artist = 'Unknown'
            }
            acc[artist] = acc[artist] ? acc[artist] + 1 : 1
          })
          return acc
        }, {})
  return counts
}

export const makeResult = (videos, page, hitsPerPage) => {
  const hits = videos.slice(hitsPerPage * page, hitsPerPage * (page+1))
  const nbHits = videos.length
  const nbPages = Math.ceil(nbHits/hitsPerPage)
  const facets = {artists: getArtistCounts(videos)}
  return {hits, nbHits, hitsPerPage, nbPages, facets}
}

export const createSearchClient = (data) => {
  const objects = data.map((x) => ({...x, objectID: x.id}))
  let resultsF, resultsA;

  const client = {
    addAlgoliaAgent: () => {},
    clearCache: () => {},
    search: async ([q]) => {
      const {query, page, hitsPerPage, facetFilters} = q.params
      console.log(q)
      const videos = filterByQuery(objects, query)
      const videosFaceted = filterByFacets(videos, facetFilters)
      resultsF = makeResult(videosFaceted, page, hitsPerPage)
      resultsA = makeResult(videos, page, hitsPerPage)
      const results = [resultsF, resultsA]
      return {results}
    },
    searchForFacetValues: async ([q]) => {
      const {facetName, facetQuery} = q.params
      const facets = resultsF.facets[facetName]
      const facetHits = Object.keys(facets)
            .filter(facet => facet.toLocaleLowerCase().indexOf(facetQuery.toLocaleLowerCase()) > -1)
            .map(key => ({value: key, count: facets[key], highlighted: key}))
      return {facetHits}

    }

  }
  return client
}
