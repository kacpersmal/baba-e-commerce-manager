import { spawn } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import type { Plugin } from 'vite'

export function openapiGenerator(
  options: {
    skipIfExists?: boolean
    maxAge?: number // minutes
    backendUrl?: string
  } = {},
): Plugin {
  const {
    skipIfExists = false,
    maxAge = 60,
    backendUrl = 'http://localhost:8000',
  } = options
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

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  const generateTypes = async () => {
    if (isGenerating || !shouldGenerate()) {
      if (!shouldGenerate()) {
        console.log('⏭️  Skipping API generation - schema.ts is recent')
      }
      return
    }

    // Check if backend is available
    const isBackendHealthy = await checkBackendHealth()
    if (!isBackendHealthy) {
      console.log('⚠️  Backend not available, skipping API generation')
      console.log(`   Make sure your NestJS server is running at ${backendUrl}`)

      // If schema.ts doesn't exist, warn but don't fail
      if (!existsSync('src/lib/api/schema.ts')) {
        console.log(
          '⚠️  schema.ts not found - you may need to start the backend and run: npm run generate:api',
        )
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
          console.log('   Try running manually: npm run generate:api')
        }
        isGenerating = false
      })

      child.on('error', (error) => {
        console.error('❌ Error spawning generate process:', error.message)
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
