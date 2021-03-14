import { promises as fs } from "fs";
import path from "path";

export const getAllVideos = async () => {
  const includeUnpublished = process.env.NODE_ENV !== "production";

  const publishedJson = path.join(process.cwd(), "..", "data", "published.json");
  const content = await fs.readFile(publishedJson, "utf8");
  let data = JSON.parse(content);
  if (!includeUnpublished) {
    data = data.filter(x => x.publish === 1);
  }
  return data;
};
