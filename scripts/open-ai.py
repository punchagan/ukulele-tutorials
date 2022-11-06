import os

import openai

openai.api_key = os.getenv("OPENAI_KEY")


text = """
Get the track name, album, artists, composer and chords for this song:
{title}

{description}

| Title | Album | Artists | Composers | Chords | Language |
"""

import pandas as pd

data = pd.read_csv("data/tutorials.csv")
unpublished = data[(data["publish"] == 0) & (data["ignore"] == 0)]

ids = list(unpublished.id)

import json
import random

random.seed(125)
id_ = random.choice(ids)
id_ = "6w5WexJ4QcM"

print(id_)
print(data[data.id == id_])

with open(f"data/.json/{id_}") as f:
    j = json.load(f)

title = j["title"]
description = j["description"]
prompt = text.format(title=title, description=description)
print(prompt)
print(title)

response = openai.Completion.create(
    model="text-davinci-002",
    prompt=prompt,
    max_tokens=100,
    temperature=0,
    best_of=1,
)
print(response)
# for resp in response:
#     print(resp)
