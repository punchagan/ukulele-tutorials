const sortByUploadDate = (a, b) => String(b.upload_date).localeCompare(String(a.upload_date))

export function filterVideos(videos, query) {
  const q = query.toLocaleLowerCase()

  return videos
    .filter((vid) => (vid.track || vid.title).toLocaleLowerCase().indexOf(q) > -1)
    .sort(sortByUploadDate)
}
