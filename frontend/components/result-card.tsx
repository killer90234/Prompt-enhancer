'use client'

import { useState } from 'react'
import { EnhancementResponse, Variant } from '../types/api'
import CopyButton from './copy-button'

interface ResultCardProps {
  result: EnhancementResponse
}

export default function ResultCard({ result }: ResultCardProps) {
  const [activeTab, setActiveTab] = useState<'primary' | number>('primary')

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    if (score >= 6) return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    return 'text-red-400 bg-red-500/10 border-red-500/20'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    return 'Needs Work'
  }

  const tabs = [
    { id: 'primary' as const, label: 'Primary', content: result.optimized_prompt },
    ...result.variants.map((variant: Variant, index: number) => ({
      id: index as number,
      label: `Variant ${index + 1}`,
      content: variant.text
    }))
  ]

  const activeContent = activeTab === 'primary'
    ? result.optimized_prompt
    : result.variants[activeTab as number]?.text

  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Enhanced Prompt</h2>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getScoreColor(result.score)}`}>
                Score: {result.score}/10 — {getScoreLabel(result.score)}
              </span>
              <span className="text-indigo-200 text-xs uppercase tracking-wider">
                {result.mode}
              </span>
            </div>
          </div>
          <CopyButton text={activeContent} />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06]">
        <nav className="flex gap-1 px-6 pt-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-800/50 text-indigo-400 border border-white/[0.08] border-b-transparent -mb-px'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Enhanced Prompt */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Enhanced Prompt</h3>
          <div className="bg-gray-800/50 border border-white/[0.06] rounded-lg p-4">
            <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">{activeContent}</p>
          </div>
        </div>

        {/* Original Prompt */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Original Prompt</h3>
          <div className="bg-gray-800/30 border border-white/[0.04] rounded-lg p-4">
            <p className="text-gray-500 text-sm whitespace-pre-wrap">{result.original_prompt}</p>
          </div>
        </div>

        {/* Explanation */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Improvements Made</h3>
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-4">
            <p className="text-indigo-300 text-sm">{result.explanation}</p>
          </div>
        </div>

        {/* Variants */}
        {result.variants.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Alternative Variants</h3>
            <div className="space-y-3">
              {result.variants.map((variant: Variant, index: number) => (
                <div key={index} className="bg-gray-800/30 border border-white/[0.06] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getScoreColor(variant.score)}`}>
                      Score: {variant.score}/10
                    </span>
                    <CopyButton text={variant.text} size="sm" />
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap mb-2">{variant.text}</p>
                  <p className="text-xs text-gray-500">{variant.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
