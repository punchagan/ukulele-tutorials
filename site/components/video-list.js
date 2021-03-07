import Link from 'next/link'
import styles from '../styles/Home.module.css'


export default function VideoList({videos}) {
  return (
      <div className={styles.grid}>
      {videos.map((video) => (
          <div className={styles.card} key={video.id}>
          <Link href={`/video/${video.id}`}>
          <h4>{video.uploader}: {video.track || video.title} by {video.artists}</h4>
          </Link>
          <img className={styles.thumbnail} src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} ></img>
          </div>))}
    </div>
  )
}
