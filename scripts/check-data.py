#!/usr/bin/env python

import json
import os

HERE = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(os.path.dirname(HERE), 'data')


def check_missing_metadata():
    with open(os.path.join(DATA_DIR, 'published.json')) as f:
        data = json.load(f)

    published = [entry for entry in data if entry['publish'] == 1]
    published_ids = {entry['id'] for entry in published}

    count = 0
    for entry in published:
        related = set(entry['id_related'].split(',')) if entry['id_related'] else set()
        if related - published_ids:
            other = related - {entry['id']}
            urls = "\n".join(f'  - http://localhost:3000/video/{r_id}' for r_id in other)
            print(f"Related videos for {entry['id']} are unpublished:\n{urls}")
            count += len(other)
        if len(entry['chords']) == 0 or len(entry['artists']) == 0 or len(entry['composers']) == 0:
            if "rabindra" in entry['album'].lower():
                continue
            print(f"{entry['track']} is broken ({entry['id']})")
            count += 1
    if count > 0:
        print(f"{count} videos are broken...")
    else:
        print(f"👍 Nothing is broken. All is well ✨🚀")


if __name__ == "__main__":
    check_missing_metadata()
