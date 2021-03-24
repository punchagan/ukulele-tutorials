import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export default function handler(req, res) {
  const { q } = req.query;
  const id = execSync(`youtube-dl --get-id "ytsearch1: ${q}"`, { encoding: "utf8" }).trim();
  const json = execSync(`youtube-dl --dump-json "${id}"`, { encoding: "utf8" }).trim();
  const meta = JSON.parse(json);
  res.status(200).json({ q, ...meta });
}
