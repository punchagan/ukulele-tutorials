import { promises as fs } from 'fs'
import path from 'path'

export async function getAllVideos() {
  const publishedJson = path.join(process.cwd(), '..', 'data', 'published.json')
  const content = await fs.readFile(publishedJson, 'utf8')
  return JSON.parse(content)
}
