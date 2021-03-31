# Ukulele Tutorials

This is a website that aggregates Ukulele Tutorials for Indian Songs
from different channels on YouTube.

The aggregation is done using tools like youtube-dl and pandas and a
lot of manual cleaning of the data.

The website is built using Next.js and React Instant Search. 

See the [about](https://ukulele.muse-amuse.in/about) page for more
information!

## Setup

To setup this repository for updating the metadata, you'd need to
install Python requirements for scraping the data from YouTube and the
js requirements for building the website.

1. Install the requirements in `requirements.txt`

2. Also setup the Next.js site

```sh
    cd site/
    yarn
    yarn dev
```

## Usage

1. To scrape data run

   ```sh
   $ ./scripts/update-data.py -d
   ```

   This creates a CSV with parsed data, after crawling through a bunch of
   channels on YouTube.

2. To view the site, run `yarn dev` inside the `site/` directory. Make
   sure that the Python venv where the requirements are installed has
   been sourced. The publishing script uses youtube-dl for some features.

3. You can manually start editing the metadata in the CSV, if you
   like. But, the Next.js site also provides an editor interface when
   running the site locally.

4. You can start editing the data from UI and publish when you are
   happy with the metadata for the song.

5. To ensure data quality, we have a tiny script that checks that all
   the metadata has been populated for a "published" song. You can run
   the check script in a separate terminal to see if data is getting
   saved correctly.

   ```sh
   ls data/* |entr ./scripts/check-data.py
   ```
