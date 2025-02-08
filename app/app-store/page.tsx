import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import AIModelDirectory from '@/components/AIModelDirectory/ai-model-directory'

export default async function AppStorePage() {
  try {
    const csvPath = path.join(process.cwd(), 'deep-link-supported-models.csv')
    const csvData = await fs.readFile(csvPath, 'utf8')
    
    const models = parse(csvData, {
      columns: true,
      skip_empty_lines: true
    })

    return <AIModelDirectory initialModels={models} />
  } catch (error) {
    console.error('Error loading models:', error)
    return <div>Error loading AI models</div>
  }
}
