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
        <h2>What is this website?</h2>
        <p>This is a website for Ukulele players featuring tutorials for Indian Songs.</p>
        <p>
          This site was inspired by <a href="https://ukealong.com">UkeAlong</a> and was created to
          be able to make it easy to find tutorials for Indian songs, and to make it easy to play
          along and learn from them. The site makes it easy to search and filter for songs, and also
          displays the Chord fingerings for each songs, and allow looping over specific sections of
          the videos.
        </p>
        <h2>Who creates these video tutorials?</h2>
        <p>
          These videos are aggregated from several different YouTube Channels/playlists. You can
          find a list of them in the{" "}
          <Link href="/#channel">
            <a>channels section</a>
          </Link>{" "}
          on the index page.
        </p>
        <h2>Who maintains this website?</h2>
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
        <h2>How can I help with adding new content to the website?</h2>
        <p>
          We currently do not have a streamlined process for letting users help us, but feel free to
          get in touch with us, using this{" "}
          <Link href="/feedback">
            <a>form</a>
          </Link>
          .
        </p>
        <h2>How are these tutorials aggregated?</h2>
        <p>
          I maintain a list of YouTube channels that have Indian Ukulele Song Tutorials. Once or
          Twice a week, I run a script that uses{" "}
          <a href="https://github.com/ytdl-org/youtube-dl">youtube-dl</a> to "scrape" the metadata
          for videos from these channels.
        </p>
        <p>
          The video descriptions and other metadata do not contain all the metadata required to add
          a video onto this site - for example, the actual chords used, artist information,
          start/end timestamps for the actual play-along for the song. I spend some time every week
          manually curating newly "scraped" videos, and adding the required metadata to them, and
          publishing them onto the site.{" "}
        </p>
        <h2>Why does a song on a channel not appear on this site?</h2>
        <p>
          The video probably hasn't yet been manually processed to add the required metadata. It
          should be out there in a few weeks or so, hopefully. If you'd like the video to appear
          quicker, feel free to submit metadata for the song using this{" "}
          <Link href="/feedback">
            <a>form</a>
          </Link>
          .
        </p>
        <h2>How can I submit requests for aggregating new YouTube Channels?</h2>
        <p>
          Please submit information about the new channel using this{" "}
          <Link href="/feedback">
            <a>form</a>
          </Link>
          .
        </p>
        <h2>How can I submit requests for tutorials on specific songs?</h2>
        <p>
          You should get in touch with one of the channels from where we aggregate, and request them
          to do a tutorial for a song. There is no way to request for new song tutorials on this
          site, currently.
        </p>

        <h2>I saved my favourites on my phone. How do I see them on my desktop?</h2>
        <p>
          This website does not have a "backend" and does not store any user information about the
          users. All your favorites are saved in your browser's local storage. You can only see them
          on the browser that you saved them in.
        </p>

        <h2>What technologies do you use to create this website?</h2>
        <p>
          The song metadata is collected using{" "}
          <a href="https://github.com/ytdl-org/youtube-dl">youtube-dl</a>. I use{" "}
          <a href="https://pandas.pydata.org/">Pandas</a> to process and/or create JSONs and CSV
          files. The front-end/UI for the site is built using{" "}
          <a href="https://nextjs.org/">Next.js</a>. The site is served as a static site using{" "}
          <a href="https://nextjs.org/docs/advanced-features/static-html-export">
            <code>next export</code>
          </a>
          . The search functionality is built using{" "}
          <a href="https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/">
            React InstantSearch
          </a>{" "}
          by Algolia.
        </p>
        <p>
          The chord diagrams are generated using the two wonderful packages by{" "}
          <a href="https://github.com/tombatossals">David Rubert</a> &mdash;{" "}
          <a href="https://github.com/tombatossals/chords-db">chords-db</a> and{" "}
          <a href="https://github.com/tombatossals/react-chords">react-chords</a>.
        </p>
        <h2>Can you add a page with all the chord diagrams?</h2>
        <p>
          You can find a page <a href="https://tombatossals.github.io/chords-db/ukulele">here</a>{" "}
          created using chords-db and react-chords. If you are using a Baritone Ukulele, you can see
          the Guitar chord shapes, and ignore the top two strings. This site also generates the
          diagrams for Baritone Ukulele songs, using this technique.
        </p>
        <h2>
          I am a beginner/intermediate Ukulele player who can play a few chords and a few songs. Do
          you have any tips that you wish someone told you when you started?
        </h2>
        <p>
          I really like these 12 tips in{" "}
          <a href="https://www.youtube.com/watch?v=PfndlSCeWeo">this</a> video. My top 5 tips from
          this video are:
        </p>
        <dl>
          <dt>Tip #12</dt> <dd>Sleep &ndash; It helps consolidate learning </dd>
          <dt>Tip #9</dt> <dd>Promise yourself to practice 5 minutes every day</dd>
          <dt>Tip #1</dt> <dd>Learn complete songs that you actually love!</dd>
          <dt>Tip #4</dt> <dd>Learn to play in time</dd>
          <dt>Tip #11</dt> <dd>Practice playing in the dark</dd>
        </dl>
      </div>
    </Layout>
  );
}
