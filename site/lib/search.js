const sortByUploadDate = (a, b) => String(b.upload_date).localeCompare(String(a.upload_date))

export const filterVideos = (videos, query) => {
  const q = query.toLocaleLowerCase()

  return videos
    .filter((vid) => (vid.track || vid.title).toLocaleLowerCase().indexOf(q) > -1)
    .sort(sortByUploadDate)
}

export const createSearchClient = (data) => {
  const client = {
    addAlgoliaAgent: () => {},
    clearCache: () => {},
    search: async ([q]) => {
      const videos = filterVideos(data, q.params.query)
      const hits = videos.map((x) => ({...x, objectID: x.id}))
      const results = [{hits, page: 0, nbHits: videos.length, hitsPerPage: 10}]
      return {results}
    },
    searchForFacetValues: (q) => {
      console.log(q, 'searchForFacetvalues')
    }

  }
  return client
}
