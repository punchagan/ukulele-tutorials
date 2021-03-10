import {useState} from 'react'
import Link from 'next/link'
import Layout from '../../components/layout'
import Player from '../../components/player'
import {VideoList} from '../../components/video-list'
import {getAllVideos} from '../../lib/pages'
import styles from '../../styles/Home.module.css'
import Chord from '@tombatossals/react-chords/lib/Chord'
import ukeChordsDB from '@tombatossals/chords-db/lib/ukulele'


const findChord = (chord) => {
  const [_, key, s] = chord.match(/([A-G]b*)(.*)/)
  let suffix;
  switch (s) {
  case "":
    suffix = "major"
    break;
  case "m":
    suffix = "minor"
    break;
  default:
    suffix = s
    break;
  }
  const chordData = ukeChordsDB.chords[key].find(it => it.suffix === suffix)
  return chordData?.positions[0]
}

export default function Video({ video, videos }) {
  const otherIds = video.id_related ?
        video.id_related.split(',').filter(it => it !== video.id) :
        []
  const otherVersions = otherIds.map(it => videos.find((v) => v.id === it))
  const videoChords = video.chords?.split(',')
  const instrument = {...ukeChordsDB.main, tunings: ukeChordsDB.tunings}
  const [showChords, setShowChords] = useState(false)

  return (
    <Layout>
      <div>
        <Player url={`https://youtube.com/v/${video.id}`}
                start={video.loop_start} end={video.loop_end}/>
      <p>Chords: {video.chords}</p>
      <div className={styles.chordDiagrams}>
        {videoChords && <p><input type="checkbox" onChange={(e) => setShowChords(e.target.checked)}/> Chord Diagrams</p>}
        {showChords && videoChords?.map(chord => (
          <div key={chord}>
            <h5>{chord}</h5>
            <Chord lite={false} instrument={instrument} chord={findChord(chord)}/>
          </div>
        ))}
      </div>
      <p>Album: {video.album}</p>
      <p>Composer(s): {video.composer}</p>
      <p>Artist(s): {video.artists}</p>
      <p>
        This video was uploaded by <Link href={`https://youtube.com/channel/${video.channel}?sub_confirmation=1`}>{video.uploader}</Link>.
        Support this channel by subscribing and liking the <Link href={`https://youtube.com/v/${video.id}`}> video on YouTube</Link>.
      </p>
      {video.id_related && (
        <div>
          <h2>Other Versions</h2>
          <VideoList videos={otherVersions} />
        </div>
      )}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const videos = await getAllVideos()
  const paths = videos.map(({id}) => ({params: {id}}))
  return {
    paths: paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const {id} = params
  const videos = await getAllVideos()
  const video = videos.find((v) => v.id === id) || null
  return { props: {video, videos} }
}
