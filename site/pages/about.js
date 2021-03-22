import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About - Ukelele Tutorials for Indian Songs</title>
        <meta
          name="description"
          content="About page for Ukulele Tutorials for Indian Songs site."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h3>What is this website?</h3>
        <p>This is a website for Ukulele players featuring tutorials for Indian Songs.</p>
        <p>
          This site was inspired by <a href="https://ukealong.com">UkeAlong</a> and was created to
          be able to make it easy to find tutorials for Indian songs, and to make it easy to play
          along and learn from them. The site makes it easy to search and filter for songs, and also
          displays the Chord fingerings for each songs, and allow looping over specific sections of
          the videos.
        </p>
        <h3>Who creates these video tutorials?</h3>
        <p>
          These videos are aggregated from several different YouTube Channels/playlists. You can
          find a list of them in the Channels section on the index page.
        </p>
        <h3>Who maintains this website?</h3>
        <p>
          This website was created and is maintained by{" "}
          <a href="https://twitter.com/punchagan">punchagan</a>. I have recently started learning to
          play the Ukulele, and created this site to make the process of finding new songs to learn,
          and the process of learning them slightly easier for myself. If you find this website
          useful, feel free to let me know via twitter or this{" "}
          <Link href="/feedback">
            <a>form</a>
          </Link>
          . Do let your Ukulele playing friends know about it, too!
        </p>
        <h3>How are these tutorials aggregated?</h3>
        <p>
          I maintain a list of YouTube channels that have Indian Ukulele Song Tutorials. Once or
          Twice a week, I run a script that uses{" "}
          <a href="https://github.com/ytdl-org/youtube-dl">youtube-dl</a> to "scrape" the metadata
          for videos from these channels.
        </p>
        <p>
          The video descriptions and other metadata don't contain all the metadata required to add a
          video onto this site - for example, the actual chords used, artist information, start/end
          timestamps for the actual play-along for the song. I spend some time every week manually
          curating newly "scraped" videos, and adding the required metadata to them, and publishing
          them onto the site.{" "}
        </p>
        <h3>Why does a song on a channel not appear on this site?</h3>
        <p>
          The video probably hasn't yet been manually processed to add the required metadata. It
          should be out there in a few weeks or so, hopefully. If you'd like the video to appear
          quicker, feel free to submit metadata for the song using this{" "}
          <Link href="/feedback">
            <a>form</a>
          </Link>
          .
        </p>
        <h3>How can I submit requests for aggregating new YouTube Channels?</h3>
        <p>
          Please submit information about the new channel using this{" "}
          <Link href="/feedback">
            <a>form</a>
          </Link>
          .
        </p>
        <h3>How can I submit requests for tutorials on specific songs?</h3>
        <p>
          You should get in touch with one of the channels from where we aggregate, and request them
          to do a tutorial for a song. There's no way to request for new song tutorials on this
          site, currently.
        </p>
        <h3>What technologies do you use to create this website?</h3>
        <p>
          The song metadata is collected using{" "}
          <a href="https://github.com/ytdl-org/youtube-dl">youtube-dl</a>. The front-end/UI for the
          site is built using <a href="https://nextjs.org/">Next.js</a>. The site is served as a
          static site using{" "}
          <a href="https://nextjs.org/docs/advanced-features/static-html-export">
            <code>next export</code>
          </a>
          . The search functionality is built using{" "}
          <a href="https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/">
            React InstantSearch
          </a>{" "}
          by Algolia.
        </p>{" "}
      </div>{" "}
    </Layout>
  );
}
