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

  const modeDescriptions: Record<EnhancementMode, string> = {
    [EnhancementMode.STANDARD]: 'Balanced enhancement for general use',
    [EnhancementMode.CREATIVE]: 'Focus on creativity and storytelling',
    [EnhancementMode.TECHNICAL]: 'Precise and structured for technical tasks',
    [EnhancementMode.CONCISE]: 'Make prompts more brief and efficient',
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Enhancement Mode
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.values(EnhancementMode).map((modeOption: EnhancementMode) => (
              <button
                key={modeOption}
                type="button"
                onClick={() => setMode(modeOption)}
                className={`px-3 py-2 text-sm rounded-lg transition-all font-medium ${
                  mode === modeOption
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-gray-800/50 text-gray-400 border border-white/[0.06] hover:border-white/[0.12] hover:text-gray-200'
                }`}
              >
                {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {modeDescriptions[mode]}
          </p>
        </div>

        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Enter your prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            className="w-full px-4 py-3 bg-gray-800/50 border border-white/[0.08] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all min-h-[120px] resize-vertical text-sm"
            disabled={loading}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-600">
              {prompt.length}/5000 characters
            </span>
            <span className="text-xs text-gray-600">
              {prompt.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-all font-medium text-sm flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Enhancing...
            </>
          ) : (
            'Enhance Prompt'
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
        <h3 className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-2">Tips for better prompts</h3>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>• Be specific about what you want the AI to do</li>
          <li>• Include context and constraints when relevant</li>
          <li>• Specify the desired tone or style</li>
          <li>• Mention the target audience if applicable</li>
        </ul>
      </div>
    </div>
  )
}
