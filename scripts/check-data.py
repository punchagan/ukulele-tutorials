#!/usr/bin/env python

import json
import os

HERE = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(os.path.dirname(HERE), 'data')


def check_missing_metadata():
    with open(os.path.join(DATA_DIR, 'published.json')) as f:
        data = json.load(f)

    published = [entry for entry in data if entry['publish'] == 1]
    count = 0
    for entry in published:
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
