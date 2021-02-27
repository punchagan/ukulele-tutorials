import Link from 'next/link'
import ReactPlayer from "react-player"
import Layout from '../../components/layout'
import {getAllVideos} from '../../lib/pages'

export default function Video({ video }) {
  return (
    <Layout>
      <div>
      <ReactPlayer url={`https://youtube.com/v/${video.id}`}
                   light={false}
                   controls={true}
                   config={{
                     youtube: {
                       playerVars: {
                         color: "white",
                         modestbranding: 1,
                         rel: 0,
                         showinfo: 0,
                       }
                     }
                   }}
                   />
      <p>Chords: {video.chords}</p>
      <p>Album: {video.album}</p>
      <p>Composer(s): {video.composer}</p>
      <p>Artist(s): {video.artists}</p>
      <p>
        This video was uploaded by <Link href={`https://youtube.com/channel/${video.channel}?sub_confirmation=1`}>{video.uploader}</Link>.
        Support this channel by subscribing and liking the <Link href={`https://youtube.com/v/${video.id}`}> video on YouTube</Link>.
      </p>
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
  return { props: {video} }
}
