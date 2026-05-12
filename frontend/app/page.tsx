'use client'

import { useState } from 'react'
import PromptInput from '../components/prompt-input'
import ResultCard from '../components/result-card'
import { EnhancementResponse } from '../types/api'

export default function Home() {
  const [result, setResult] = useState<EnhancementResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async (prompt: string, mode: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, mode }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail?.error || errorData.error || 'Failed to enhance prompt')
      }

      const data: EnhancementResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PromptForge AI
          </h1>
          <p className="text-lg text-gray-600">
            Enhance your AI prompts with advanced optimization techniques
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <PromptInput 
            onEnhance={handleEnhance}
            loading={loading}
          />
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {result && (
            <div className="mt-6 animate-fade-in">
              <ResultCard result={result} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by Inforium Alliance</p>
        </div>
      </div>
    </div>
  )
}