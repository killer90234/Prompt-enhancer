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
    if (score >= 8) return 'text-green-600 bg-green-50'
    if (score >= 6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Enhanced Prompt</h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
                Score: {result.score}/10 - {getScoreLabel(result.score)}
              </span>
              <span className="text-blue-200 text-sm">
                Mode: {result.mode}
              </span>
            </div>
          </div>
          <CopyButton text={activeContent} />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Enhanced Prompt */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Enhanced Prompt</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap">{activeContent}</p>
          </div>
        </div>

        {/* Original Prompt */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Prompt</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 whitespace-pre-wrap">{result.original_prompt}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Improvements Made</h3>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-800">{result.explanation}</p>
          </div>
        </div>

        {/* Variants Comparison */}
        {result.variants.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Alternative Variants</h3>
            <div className="space-y-4">
              {result.variants.map((variant: Variant, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(variant.score)}`}>
                      Score: {variant.score}/10
                    </span>
                    <CopyButton text={variant.text} size="sm" />
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap mb-2">{variant.text}</p>
                  <p className="text-sm text-gray-600">{variant.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}