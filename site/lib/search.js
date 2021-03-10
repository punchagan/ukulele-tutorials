const sortByUploadDate = (a, b) => String(b.upload_date).localeCompare(String(a.upload_date))

export const filterByQuery = (videos, query) => {
  const q = query.toLocaleLowerCase()

  return videos
    .filter((vid) => (vid.track || vid.title).toLocaleLowerCase().indexOf(q) > -1)
    .sort(sortByUploadDate)
}

export const filterByFacets = (videos, facetFilters) => {

  const filterRegExps = facetFilters?.reduce((obj, ff) => {
    const key = ff[0].split(':')[0]
    return {...obj, [key]: new RegExp(ff.map(f => f.split(':')[1]).join("|"))}
  }, {})

  let data = videos
  for (let attribute in filterRegExps) {
    let re = filterRegExps[attribute]
    data = data.filter(vid => vid[attribute]?.search(re) > -1)
  }

  return data
}

const getArtistCounts = (data) => {
  const counts = data
        .filter(v => v.artists !== null)
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

const getCounts = (data, attribute) => {
  const counts = data
        .reduce((acc, video) => {
          const val = video[attribute]
          acc[val] = acc[val] ? acc[val] + 1 : 1
          return acc
        }, {})
  return counts
}

const getUploaderCounts = (data) => getCounts(data, "uploader")
export const makeResult = (videos, page, hitsPerPage) => {
  const hits = videos.slice(hitsPerPage * page, hitsPerPage * (page+1))
  const nbHits = videos.length
  const nbPages = Math.ceil(nbHits/hitsPerPage)
  const facets = {artists: getArtistCounts(videos), uploader: getUploaderCounts(videos)}
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
