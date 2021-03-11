import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Layout({ children, title = "This is the default title" }) {
  return (
    <div>
      <Head>
        <title>Ukulele Tutorials for Indian Music</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Link href="/">Welcome to uke-tutorials.in!</Link>
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
