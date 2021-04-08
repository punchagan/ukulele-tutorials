import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { id } = req.query;
  const metadataFile = path.join(process.cwd(), "..", "data", ".json", id);
  const metadata = JSON.parse(fs.readFileSync(metadataFile, { encoding: "utf8" }));
  res.status(200).json(metadata || {});
}
