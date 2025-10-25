import { spawn } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import type { Plugin } from 'vite'

export function openapiGenerator(
  options: {
    skipIfExists?: boolean
    maxAge?: number // minutes
  } = {},
): Plugin {
  const { skipIfExists = false, maxAge = 60 } = options
  let isGenerating = false

  const shouldGenerate = (): boolean => {
    if (!skipIfExists) return true

    const schemaPath = 'src/lib/api/schema.ts'
    if (!existsSync(schemaPath)) return true

    // Check if file is older than maxAge
    const stats = statSync(schemaPath)
    const ageInMinutes = (Date.now() - stats.mtime.getTime()) / (1000 * 60)

    return ageInMinutes > maxAge
  }

  const generateTypes = async () => {
    if (isGenerating || !shouldGenerate()) {
      if (!shouldGenerate()) {
        console.log('⏭️  Skipping API generation - schema.ts is recent')
      }
      return
    }

    isGenerating = true
    console.log('🔄 Generating API types from OpenAPI schema...')

    try {
      const child = spawn('npm', ['run', 'generate:api'], {
        stdio: 'inherit',
        shell: true,
      })

      child.on('close', (code) => {
        if (code === 0) {
          console.log('✅ API types generated successfully')
        } else {
          console.error('❌ Failed to generate API types')
        }
        isGenerating = false
      })
    } catch (error) {
      console.error('❌ Error generating API types:', error)
      isGenerating = false
    }
  }

  return {
    name: 'openapi-generator',
    // Only run during development
    configureServer() {
      generateTypes()
    },
  }
}
