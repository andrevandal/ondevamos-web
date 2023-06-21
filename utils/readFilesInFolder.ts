/* eslint-disable no-console */
import fs from 'fs/promises'
import path from 'path'

// Async function to read the contents of files in a folder
async function readFiles(folderPath: string): Promise<void> {
  try {
    const fileNames = await fs.readdir(folderPath)
    let allContents = ''

    for (const fileName of fileNames) {
      const filePath = path.join(folderPath, fileName)
      const fileStats = await fs.stat(filePath)

      if (fileStats.isFile()) {
        const content = await fs.readFile(filePath, { encoding: 'utf-8' })
        allContents += `\n\`${fileName}\`\n\`\`\`${content}\`\`\`\n`
      }
    }

    console.log(allContents)
  } catch (err) {
    console.error('Error reading files:', err)
  }
}
// Replace with the path to your folder
const folderPath = './server/models'
await readFiles(folderPath)
