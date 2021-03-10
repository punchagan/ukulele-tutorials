const sortByUploadDate = (a, b) => String(b.upload_date).localeCompare(String(a.upload_date))

export const filterVideos = (videos, query) => {
  const q = query.toLocaleLowerCase()

  return videos
    .filter((vid) => (vid.track || vid.title).toLocaleLowerCase().indexOf(q) > -1)
    .sort(sortByUploadDate)
}

export const createSearchClient = (data) => {
  const objects = data.map((x) => ({...x, objectID: x.id}))
  const client = {
    addAlgoliaAgent: () => {},
    clearCache: () => {},
    search: async ([q]) => {
      console.log(q, '???')
      const {query, page} = q.params
      const hitsPerPage = 20
      const videos = filterVideos(objects, query)
      const hits = videos.slice(hitsPerPage*page, hitsPerPage*(page+1))
      const nbHits = videos.length
      const nbPages = Math.ceil(nbHits/hitsPerPage)
      const results = [{hits, nbHits, hitsPerPage, nbPages, exhaustiveNbHits: true}]
      return {results}
    },
    searchForFacetValues: (q) => {
      console.log(q, 'searchForFacetvalues')
    }

  }
  return client
}
