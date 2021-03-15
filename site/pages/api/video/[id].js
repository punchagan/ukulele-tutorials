import fs from "fs";
import * as csv from "fast-csv";
import path from "path";
import { execFileSync } from "child_process";

const editCSVRow = (videoId, data) => {
  const csvFile = path.join(process.cwd(), "..", "data", "tutorials.csv");
  const outFile = path.join(process.cwd(), "..", "data", "tutorials-2.csv");
  const script = path.join(process.cwd(), "..", "scripts", "update-data.py");
  const parse = csv.parse({
    headers: true
  });
  const writeCSV = fs.createWriteStream(outFile);
  const transform = csv.format({ headers: true }).transform(row => {
    if (row.id == videoId) {
      return { ...row, ...data };
    }
    return row;
  });
  const stream = fs
    .createReadStream(csvFile)
    .pipe(parse)
    .pipe(transform)
    .pipe(writeCSV);

  fs.rename(outFile, csvFile, err => {
    if (err) throw err;
    console.log(`Updated ${csvFile}!`);
    setTimeout(() => {
      execFileSync(script);
      console.log("Updated published.json");
    }, 2000);
  });
};

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === "PUT") {
    editCSVRow(id, req.body);
    res.status(200).json({ status: "success" });
  }
  res.status(405);
}
