#!/usr/bin/env python
from concurrent.futures import ThreadPoolExecutor
import io
import json
import os
import re
import time

import pandas as pd
import youtube_dl

CHANNELS = [
    'https://www.youtube.com/c/SayaliTank/videos',
    'https://www.youtube.com/c/BollyUkeBollywoodUkuleleTutorials/videos',
    'https://www.youtube.com/c/ukeguide/videos',
    'https://www.youtube.com/c/ManidipaBaisya/videos',
    'https://www.youtube.com/watch?list=PLlp3FyjV884Ci7xLYompeesJJUA5TA0Ni', # TarunMishram
    'https://www.youtube.com/watch?list=PLCAuWzdnX8zIevYBDnFyGdOOdsbZRhJGJ', # NabidAlam360
    'https://www.youtube.com/c/ArathiUnnikrishnan/videos',
    'https://www.youtube.com/c/AvniKulshreshtha/videos',
    'https://www.youtube.com/c/UkuleleAdda/videos',  # Baritone
    'https://www.youtube.com/channel/UCCHSNlm8UTsY_8sUoEAH5sA/videos',  # Hassan Khan
    'https://www.youtube.com/channel/UCTxnAa2uGE2lk1CSfL8Amjw/videos',  # the chashmish
    # 'https://www.youtube.com/channel/UCX86Z7SknJnTtTsGABezFdQ/videos', # Uke Bajao - Melody tutorials

]

HERE = os.path.abspath(os.path.dirname(__file__))
TITLE_RE = re.compile(
    '((simple|playalong) )*ukulele(\s+playalong)* tutot*rial\s*(with playalong)*|'
    '(with)*\s*play\s*along|'
    '\w+ (day\s)*special|'
    'fro|'
    'sayali tank|bollyuke|'
    'advance|level|fingerpicking|'
    '\(hindi\)|'
    'youtube live|'
    'simple chords( & strumming)*|'
    'simple \d chords only|'
    '(simple )*only \d+(-\d)* ((simple|basic)\s)*chords\?*|'
    'intermediate|(for )*(complete )*beginners*|easy( tutorial)*|(with\s)*tabs',
    flags=re.IGNORECASE|re.MULTILINE)
CHORDS_RE = re.compile('(?:chords(?: used)*\s*:\s*)((?:\w|,|\.|#| )+)$',
                       flags=re.IGNORECASE|re.MULTILINE)
ALBUM1_RE = re.compile('\((.*)\)', flags=re.IGNORECASE|re.MULTILINE)
ALBUM2_RE = re.compile('(?:movie|film|album)\s*(?:–|:|-)+\s*((?:\w| )+)',
                       flags=re.IGNORECASE|re.MULTILINE)
ARTISTS_RE = re.compile('(?:singer\(*s*\)*|artists*)\s*(?:–|:|-)+\s*((?:[A-Za-z0-9]| |\.|&|,)+)',
                        flags=re.IGNORECASE|re.MULTILINE)
COMPOSER_RE = re.compile('(?:music(?: director)*|compose(?:r|d)|'
                         'arranged|reprised|recreated)\s*'
                         '(?: by){0,1}\s*'
                         '(?:–|:|-)+\s*'
                         '((?:\w| |\.|&|,|-)+)',
                         flags=re.IGNORECASE|re.MULTILINE)
SONG_INFO_RE = re.compile('(, )(music|lyrics|singers*|music director|movie|composer)',
                          flags=re.IGNORECASE|re.MULTILINE)


class Updater:

    def __init__(self):
        self.ydl_opts = {
            'dump_single_json': True,
            'simulate': True,
            'quiet': True,
            'geo_bypass': True,
            'ignoreerrors': True, # Don't stop on download errors
        }
        self.json_dir = os.path.join(os.path.dirname(HERE), '.json')
        self.data_dir = os.path.join(os.path.dirname(HERE), 'data')
        self.data_csv = os.path.join(self.data_dir, 'tutorials.csv')
        self.data_json = os.path.join(self.data_dir, 'published.json')
        os.makedirs(self.json_dir, exist_ok=True)

    def download_json(self, url):
        print(f'Downloading json for {url} ...')
        start = time.time()
        with youtube_dl.YoutubeDL(self.ydl_opts) as ydl:
            with io.StringIO() as f:
                ydl._screen_file = f
                ydl.download([url])
                f.seek(0)
                data = json.load(f)

        name = f"{data['id']}.json"
        with open(os.path.join(self.json_dir, name), 'w') as f:
            json.dump(data, f, indent=2)

        n = len(data.get('entries', []))
        t = time.time() - start
        print(f'Wrote {n} entries for {url} to {f.name} in {t} seconds')

    def download_all_jsons(self):
        # Delete all existing JSON files before downloading
        files = os.listdir(self.json_dir)
        for each in files:
            os.remove(os.path.join(self.json_dir, each))

        with ThreadPoolExecutor(max_workers=6) as e:
            for channel in CHANNELS:
                e.submit(self.download_json, channel)

    def parse_json(self, path):
        with open(path) as f:
            data = json.load(f)

        videos = []
        for i, entry in enumerate(data['entries'], start=1):
            if entry is None:
                continue
            ignore = self._ignore_video(entry)
            video = {
                'publish': int(False),
                'ignore': int(ignore),
                'id': entry['id'],
                'uploader': entry['uploader'],
                'channel': entry['channel_id'],
                'upload_date': entry['upload_date'],
                'loop_start': 0,
                'loop_end': entry['duration'],
                'title': entry['title'],
            }
            if not ignore:
                video.update(self._extract_info(entry))
            videos.append(video)
        return pd.DataFrame(videos)

    def parse_all_jsons(self):
        files = os.listdir(self.json_dir)
        parsed = []
        for each in files:
            path = os.path.join(self.json_dir, each)
            parsed.append(self.parse_json(path))

        data = self._merge_into_existing(pd.concat(parsed))
        data = self._update_related(data)
        self._write_data(data)

    def _write_data(self, data):
        data.to_csv(self.data_csv, index=False)
        non_ignored_rows = data['ignore'] != 1

        def sort_list(x):
            return sorted(filter(None, x))

        # Split chords and artists into lists
        data.loc[non_ignored_rows, 'chords'] = data.loc[non_ignored_rows, 'chords']\
                                                   .fillna('')\
                                                   .str.split(',').apply(sort_list)
        data.loc[non_ignored_rows, 'artists'] = data.loc[non_ignored_rows, 'artists']\
                                                   .fillna('')\
                                                   .str.replace(', ', ',')\
                                                   .str.split(',').apply(sort_list)
        non_ignored = data[non_ignored_rows]
        non_ignored.to_json(self.data_json, orient='records', indent=2, force_ascii=False)
        print(non_ignored.tail())
        print(f'Updated {self.data_json}')

    def _update_related(self, data):
        def join(row):
            return '' if len(row) == 1 else ','.join(row)
        related = data.groupby(['track', 'album']).agg({'id': join}).drop_duplicates()
        # Drop existing id_related column, since we are creating a new one
        columns = [c for c in data.columns if c != 'id_related']
        data = data[columns]
        return data.merge(related, how='left', on=['track', 'album'], suffixes=['', '_related'])

    def _merge_into_existing(self, data):
        existing = pd.read_csv(self.data_csv)

        # Prefer hand processed data, if exists.  NOTE: We assume
        # ignored rows are hand processed, to simplify the code
        # here. Manually, unset ignore flag to use the newly parsed
        # data for these rows.
        hand_processed = existing.query('publish == 1 or ignore == 1')
        hand_processed_parsed = data[data['id'].isin(hand_processed['id'])]
        hand_processed = pd.concat([hand_processed, hand_processed_parsed])\
                           .groupby('id').agg('first').reset_index()

        # When not manually edited, use the newly parsed data
        new = data[~data['id'].isin(hand_processed['id'])]
        data = pd.concat([hand_processed, new]).drop_duplicates()

        # Sort columns and values
        column_order = [
            'title', 'track', 'album', 'artists', 'composer', 'chords',
            'key', 'loop_start', 'loop_end', 'publish',
        ]
        columns = sorted(data.columns,
                         key=lambda x: column_order.index(x) if x in column_order else 100)
        data = data[columns].sort_values(
            ['ignore', 'publish', 'track', 'album', 'artists', 'upload_date'],
            key=lambda col: col.str.lower() if col.dtype == 'object' else col,
            ascending=[False, False, True, True, True, True])

        return data

    def _extract_info(self, entry):
        title, _ = TITLE_RE.subn('|', entry['title'])
        title, _ = re.subn('\s*\|+(\s*\|)*\s*', '|', title)
        track, album, artists = (title.split('|', 3) + [''] * 3)[:3]
        if '(' in track:
            album = ALBUM1_RE.search(track)
            if album is not None:
                album = album.group(1).strip()
            else:
                album = ''
            track = ALBUM1_RE.sub('', track).strip()

        chords = CHORDS_RE.search(entry['description'])
        if chords is not None:
            chords = chords.group(1).strip()\
                                    .replace(' and ', ',')\
                                    .replace('.', ',')\
                                    .replace(', ', ',')\
                                    .replace(' ,', ',')\
                                    .strip(',').strip().title()

        # Add newlines for original song information
        entry['description'], _ = SONG_INFO_RE.subn(',\n\\2', entry['description'])

        album_match = ALBUM2_RE.search(entry['description'])
        if album_match is not None:
            album = album_match.group(1).strip()

        artists_match = ARTISTS_RE.search(entry['description'])
        if artists_match is not None:
            artists = artists_match.group(1).strip().strip(',').replace(' &', ',')

        composer_match = COMPOSER_RE.search(entry['description'])
        if composer_match is not None:
            composer = composer_match.group(1).strip().strip(',').replace(' &', ',')
        else:
            composer = ''

        info = {
            'ignore': int(not title),
            'track': track.title(),
            'artists': artists.title(),
            'album': album.title(),
            'composer': composer.title(),
            'chords': chords,
            'key': '',
        }
        return info

    def _ignore_video(self, entry):
        title = entry['title'].lower()
        select_words = {'tutorial', 'playalong', 'lesson'}
        drop_words = {'mashup', 'medley', 'unboxing', 'how to practise', 'what is', 'ukebox',
                      'introduction'}
        for word in drop_words:
            if word in title:
                return True
        for word in select_words:
            if word in title:
                return False
        return True


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--download-data', action='store_true', default=False)

    options = parser.parse_args()
    u = Updater()
    if options.download_data:
        u.download_all_jsons()
    u.parse_all_jsons()
