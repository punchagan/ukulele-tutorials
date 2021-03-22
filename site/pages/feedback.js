import Head from "next/head";
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
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSf2cCvp-z0k9DX6E8DLlHUC5X8SBEOCFF0-rPsTrQl6oznuuA/viewform?embedded=true"
          width="100%"
          height="1200"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading…
        </iframe>
      </div>
    </Layout>
  );
}
