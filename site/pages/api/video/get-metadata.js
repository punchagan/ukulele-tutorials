import fs from "fs";
import path from "path";

const findMetadata = (filepath, id) => {
  const data = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" }));
  const video = data.entries.filter((v) => v?.id === id)?.[0];
  return video;
};

const listPlaylistFiles = (dir) => {
  const d = fs.readdirSync(dir);
  return d.filter((f) => f.startsWith("PL")).map((f) => path.join(dir, f));
};

export default function handler(req, res) {
  const { id, channel } = req.query;
  const jsonDir = path.join(process.cwd(), "..", ".json");
  const jsonFile = path.join(jsonDir, `${channel}.json`);
  let metadata;
  if (fs.existsSync(jsonFile)) {
    metadata = findMetadata(jsonFile, id);
  } else {
    const playlists = listPlaylistFiles(jsonDir);
    for (const idx in playlists) {
      metadata = findMetadata(playlists[idx], id);
      if (metadata) {
        break;
      }
    }
  }
  res.status(200).json(metadata || {});
}
