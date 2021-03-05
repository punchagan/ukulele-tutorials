import ReactPlayer from "react-player"

export default function Player({url}) {
  return (
    <ReactPlayer url={url}
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

  )
}
