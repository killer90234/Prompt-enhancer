'use client'

import { useState } from 'react'
import { EnhancementMode } from '../types/api'

interface PromptInputProps {
  onEnhance: (prompt: string, mode: EnhancementMode) => void
  loading: boolean
}

export default function PromptInput({ onEnhance, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<EnhancementMode>(EnhancementMode.STANDARD)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onEnhance(prompt.trim(), mode)
    }
  }

  const modeDescriptions = {
    [EnhancementMode.STANDARD]: 'Balanced enhancement for general use',
    [EnhancementMode.CREATIVE]: 'Focus on creativity and storytelling',
    [EnhancementMode.TECHNICAL]: 'Precise and structured for technical tasks',
    [EnhancementMode.CONCISE]: 'Make prompts more brief and efficient',
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enhancement Mode
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.values(EnhancementMode).map((modeOption: EnhancementMode) => (
              <button
                key={modeOption}
                type="button"
                onClick={() => setMode(modeOption)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  mode === modeOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {modeDescriptions[mode]}
          </p>
        </div>

        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-vertical"
            disabled={loading}
          />
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">
              {prompt.length}/5000 characters
            </span>
            <span className="text-sm text-gray-500">
              {prompt.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Enhancing...
            </>
          ) : (
            'Enhance Prompt'
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for better prompts:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about what you want the AI to do</li>
          <li>• Include context and constraints when relevant</li>
          <li>• Specify the desired tone or style</li>
          <li>• Mention the target audience if applicable</li>
        </ul>
      </div>
    </div>
  )
}