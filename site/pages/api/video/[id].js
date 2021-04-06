import fs from "fs";
import * as csv from "csv/lib/sync";
import path from "path";
import { execFileSync } from "child_process";

const editCSVRow = (videoId, data) => {
  const csvFile = path.join(process.cwd(), "..", "data", "tutorials.csv");
  const script = path.join(process.cwd(), "..", "scripts", "update-data.py");

  const csvData = fs.readFileSync(csvFile, { encoding: "utf-8" });
  const parsedData = csv.parse(csvData, { columns: true });
  const updatedData = csv.transform(parsedData, (row) => {
    if (row.id == videoId) {
      return { ...row, ...data };
    }
    return row;
  });
  fs.writeFileSync(csvFile, csv.stringify(updatedData, { header: true }), { encoding: "utf-8" });
  execFileSync(script, ["-j"]);
  console.log("Updated published.json");
};

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === "PUT") {
    editCSVRow(id, req.body);
    res.status(200).json({ status: "success" });
  }
  res.status(405);
}
