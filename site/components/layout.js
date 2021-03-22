import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Layout({ children, title = "This is the default title" }) {
  return (
    <div>
      <Head>
        <title>Ukulele Tutorials for Indian Songs!</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          defer
          data-domain="ukulele.muse-amuse.in"
          src="https://plausible.io/js/plausible.js"
        />
      </Head>

      <header className={styles.siteHeader}>
        <Link href="/">
          <a className={styles.siteTitle}>Ukulele Tutorials for Indian Songs!</a>
        </Link>
        <nav>
          <Link href="/about">
            <a className={styles.navItem}>About</a>
          </Link>
          <Link href="/feedback">
            <a className={styles.navItem}>Feedback</a>
          </Link>
        </nav>
      </header>

      {children}

      <footer className={styles.footer}>
        <p>
          &ldquo;Somebody on the Internet thinks what you do is stupid or evil or it's all been done
          before? Make good art. &hellip; Do what only you do best. Make good art.&rdquo; &mdash;
          Neil Gaiman
        </p>
      </footer>
    </div>
  );
}
