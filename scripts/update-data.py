#!/usr/bin/env python
from concurrent.futures import ThreadPoolExecutor
import io
import json
import os
import random
import re
import time

import pandas as pd
import yaml
import youtube_dl

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
COMPOSERS_RE = re.compile('(?:music(?: director)*|compose(?:r|d)|'
                         'arranged|reprised|recreated)\s*'
                         '(?: by){0,1}\s*'
                         '(?:–|:|-)+\s*'
                         '((?:\w| |\.|&|,|-)+)',
                         flags=re.IGNORECASE|re.MULTILINE)
SONG_INFO_RE = re.compile('(, )(music|lyrics|singers*|music director|movie|composer)',
                          flags=re.IGNORECASE|re.MULTILINE)

COLUMNS = ['ignore', 'publish', 'id', 'track', 'chords', 'key',
           'album', 'artists', 'composers', 'language',
           'loop_start', 'loop_end',
           'title', 'channel', 'upload_date', 'uploader', 'baritone']

class Updater:

    def __init__(self):
        self.ydl_opts = {
            'dump_single_json': True,
            'simulate': True,
            'quiet': True,
            'ignoreerrors': True, # Don't stop on download errors
            'youtube_include_dash_manifest': False,
            'socket_timeout': 30,
        }
        self.data_dir = os.path.join(os.path.dirname(HERE), 'data')
        self.dump_dir = os.path.join(self.data_dir, '.json')
        self.ignored_dir = os.path.join(self.dump_dir, 'ignored')
        self.data_csv = os.path.join(self.data_dir, 'tutorials.csv')
        self.data_json = os.path.join(self.data_dir, 'published.json')
        os.makedirs(self.ignored_dir, exist_ok=True)

    def fetch_video_metadata(self, video_id):
        with youtube_dl.YoutubeDL(self.ydl_opts) as ydl:
            with io.StringIO() as f:
                ydl._screen_file = f
                ydl.download([video_id])
                f.seek(0)
                data = json.load(f)
        with open(os.path.join(self.dump_dir, video_id), 'w') as f:
            json.dump(data, f, indent=2)
        return data

    def download_new_video_metadata(self, videos):
        dump_data = set(os.listdir(self.dump_dir))
        ignored_data = set(os.listdir(self.ignored_dir))
        new_videos = [
            video for video in videos if video['id'] not in (dump_data | ignored_data)
        ]
        n = len(new_videos)
        for i, video in enumerate(new_videos, start=1):
            video_id = video['id']
            if video_id in dump_data:
                continue

            print(f"Fetching full metadata for video {i} of {n} ...")
            ignored = self._ignore_video(video)
            if not ignored:
                time.sleep(random.randint(2, 12))
                self.fetch_video_metadata(video_id)
            else:
                with open(os.path.join(self.ignored_dir, video_id), 'w') as f:
                    json.dump(video, f, indent=2)
            dump_data.add(video_id)

    def update_all_channels(self):
        channels = self._read_channel_data()
        active_channels = [channel for channel in channels if channel.get('active', True)]
        ydl_opts = dict(self.ydl_opts)
        ydl_opts.update({'extract_flat': 'in_playlist'})

        all_entries = []
        start = time.time()
        for channel in active_channels:
            url = channel['url']
            name = channel.get('name', url)
            print(f'Getting video list for {name} ...')
            with youtube_dl.YoutubeDL(ydl_opts) as ydl:
                with io.StringIO() as f:
                    ydl._screen_file = f
                    ydl.download([url])
                    f.seek(0)
                    data = json.load(f)

            channel['id'] = data.get('uploader_id', data['id'])
            channel['name'] = (
                f"{data['uploader']} - {data['title']}" if 'uploader' in data else data['title']
            )
            all_entries.extend(data['entries'])

        t = time.time() - start
        n = len(all_entries)
        c = len(active_channels)
        print(f'Fetched initial metadata for {n} videos from {c} channels in {t} seconds')
        self._write_channel_data(channels)
        self.download_new_video_metadata(all_entries)

    def _read_channel_data(self):
        with open(os.path.join(self.data_dir, 'channels.yml')) as f:
            data = yaml.load(f, Loader=yaml.FullLoader)
        return data['channels']

    def _write_channel_data(self, channels):
        with open(os.path.join(self.data_dir, 'channels.yml'), 'w') as f:
            yaml.dump({'channels': channels}, f)

    def parse_entries(self, entries):
        videos = []
        channels = self._read_channel_data()
        for i, entry in enumerate(entries, start=1):
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
                video.update(self._extract_info(entry, channels))
            videos.append(video)
        return pd.DataFrame(videos).fillna({'key': '', 'album': ''})

    def parse_all_jsons(self):
        files = os.listdir(self.dump_dir)

        entries = []
        for each in files:
            path = os.path.join(self.dump_dir, each)
            if os.path.isdir(path):
                continue
            with open(path) as f:
                entry = json.load(f)
                entries.append(entry)

        parsed = self.parse_entries(entries)
        data = self._merge_into_existing(parsed)
        self._write_data(data)

    def refresh_json_output(self):
        data = pd.read_csv(self.data_csv, dtype={'upload_date': str})\
                 .fillna({'key': '', 'album': ''})
        self._write_json_data(data)

    def _write_data(self, data):
        data.to_csv(self.data_csv, index=False)
        self._write_json_data(data)

    def _write_json_data(self, data):
        non_ignored_rows = data['ignore'] != 1

        def sort_list(x):
            return sorted(filter(None, x))

        # Split chords and artists into lists
        data.loc[non_ignored_rows, 'chords'] = data.loc[non_ignored_rows, 'chords']\
                                                   .fillna('')\
                                                   .str.replace(', ', ',')\
                                                   .str.split(',').apply(sort_list)
        data.loc[non_ignored_rows, 'artists'] = data.loc[non_ignored_rows, 'artists']\
                                                   .fillna('')\
                                                   .str.replace(', ', ',')\
                                                   .str.split(',').apply(sort_list)
        data.loc[non_ignored_rows, 'composers'] = data.loc[non_ignored_rows, 'composers']\
                                                     .fillna('')\
                                                     .str.replace(', ', ',')\
                                                     .str.split(',').apply(sort_list)
        data = self._update_related(data)
        non_ignored_rows = data['ignore'] != 1
        non_ignored = data[non_ignored_rows].sort_values(
            ['ignore', 'publish', 'track', 'album', 'artists', 'upload_date'],
            key=lambda col: col.str.lower() if col.dtype == 'object' else col,
            ascending=[False, False, True, True, True, True]
        )
        non_ignored.to_json(self.data_json, orient='records', indent=2, force_ascii=False)
        print(non_ignored.tail())
        print(f'Updated {self.data_json}')

    def _update_related(self, data):
        def join(row):
            return '' if len(row) == 1 else ','.join(row)
        related = data.query('ignore != 1')\
                      .groupby(['track', 'album'])\
                      .agg({'id': join}).drop_duplicates()
        return data.merge(related, how='left', on=['track', 'album'], suffixes=['', '_related'])

    def _merge_into_existing(self, data):
        existing = pd.read_csv(self.data_csv, dtype={'upload_date': str})\
                     .fillna({'key': '', 'album': ''})

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

        data = data[COLUMNS].sort_values(
            ['ignore', 'publish', 'track', 'album', 'artists', 'upload_date'],
            key=lambda col: col.str.lower() if col.dtype == 'object' else col,
            ascending=[False, False, True, True, True, True])

        return data

    def _extract_info(self, entry, channels):
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

        composers_match = COMPOSERS_RE.search(entry['description'])
        if composers_match is not None:
            composers = composers_match.group(1).strip().strip(',').replace(' &', ',')
        else:
            composers = ''

        channel = [c for c in channels if c.get('id') == entry['channel_id']][0]
        languages = {'hindi', 'english', 'telugu', 'tamil', 'malayalam', 'kannada',
                     'bengali', 'bangla', 'punjabi'}
        for language in languages:
            if language in entry['title'].lower():
                if language == 'bangla':
                    language = 'bengali'
                break
        else:
            language = channel['song_language']

        info = {
            'ignore': int(not title),
            'track': track.title(),
            'artists': artists.title(),
            'album': album.title(),
            'composers': composers.title(),
            'chords': chords,
            'key': '',
            'baritone': int('baritone' in title.lower()),
            'language': language.title(),
        }
        return info

    def _ignore_video(self, entry):
        title = entry['title'].lower()
        select_words = {'tutorial', 'playalong', 'lesson', 'with chords'}
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
    import sys

    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--download-data', action='store_true', default=False)
    parser.add_argument('-j', '--refresh-json-output', action='store_true', default=False)

    options = parser.parse_args()
    u = Updater()

    if options.refresh_json_output:
        u.refresh_json_output()
        sys.exit()

    if options.download_data:
        u.update_all_channels()
    u.parse_all_jsons()
