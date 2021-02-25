import io
import json
import os
from pprint import pprint

import youtube_dl

CHANNELS = [
    'https://www.youtube.com/channel/UCXNmFZc8m5w0tQbpMs6rGyA',  #BollyUke
]

HERE = os.path.abspath(os.path.dirname(__file__))


class Downloader:

    def __init__(self):
        self.ydl_opts = {
            'dump_single_json': True,
            'simulate': True,
            'quiet': True,
            'geo_bypass': True,
            'ignoreerrors': True, # Don't stop on download errors
        }
        self.json_dir = os.path.join(os.path.dirname(HERE), '.json')
        os.makedirs(self.json_dir, exist_ok=True)

    def download_json(self, url):
        print(f'Downloading json for {url} ...')
        with youtube_dl.YoutubeDL(self.ydl_opts) as ydl:
            with io.StringIO() as f:
                ydl._screen_file = f
                ydl.download([url])
                f.seek(0)
                data = json.load(f)

        name = f"{data['id']}.json"
        with open(os.path.join(self.json_dir, name), 'w') as f:
            json.dump(data, f, indent=2)

    def download_all_jsons(self):
        for channel in CHANNELS:
            downloader.download_json(channel)


if __name__ == "__main__":
    downloader = Downloader()
    downloader.download_all_jsons()
