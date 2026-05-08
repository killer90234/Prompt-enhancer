# PromptForge AI - Frontend Next.js Implementation Plan

## 🚀 Next.js Application Structure

### Root Layout (`frontend/app/layout.tsx`)

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromptForge AI - Enhance Your Prompts',
  description: 'AI-powered prompt enhancement tool using deepseek-v3.1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {children}
      </body>
    </html>
  )
}
```

### Home Page (`frontend/app/page.tsx`)

```tsx
'use client'

import { useState } from 'react'
import PromptInput from '@/components/prompt-input'
import ResultCard from '@/components/result-card'
import Loader from '@/components/loader'
import { EnhanceResponse } from '@/types/enhancement'

export default function Home() {
  const [result, setResult] = useState<EnhanceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async (prompt: string, mode: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, mode }),
      })

      if (!response.ok) {
        throw new Error('Failed to enhance prompt')
      }

      const data: EnhanceResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PromptForge AI
          </h1>
          <p className="text-gray-400">Enhance your AI prompts with expert optimization</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <PromptInput onEnhance={handleEnhance} />
          
          {loading && (
            <div className="mt-8">
              <Loader />
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="mt-8">
              <ResultCard result={result} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
```

## 🧩 Core Components

### Prompt Input Component (`frontend/components/prompt-input.tsx`)

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface PromptInputProps {
  onEnhance: (prompt: string, mode: string) => void
}

export default function PromptInput({ onEnhance }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('detailed')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onEnhance(prompt.trim(), mode)
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Enter Your Prompt
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write a blog about AI..."
            className="min-h-[120px] bg-gray-900/50 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-gray-300 mb-2">
            Enhancement Mode
          </label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
          >
            <option value="basic">Basic Enhancement</option>
            <option value="detailed">Detailed Enhancement</option>
            <option value="creative">Creative Enhancement</option>
          </select>
        </div>

        <Button 
          type="submit" 
          disabled={!prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Enhance Prompt
        </Button>
      </form>
    </div>
  )
}
```

### Result Card Component (`frontend/components/result-card.tsx`)

```tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import VariantsTabs from '@/components/variants-tabs'
import CopyButton from '@/components/copy-button'
import { EnhanceResponse } from '@/types/enhancement'

interface ResultCardProps {
  result: EnhanceResponse
}

export default function ResultCard({ result }: ResultCardProps) {
  const [activeVariant, setActiveVariant] = useState<'optimized' | 'creative' | 'technical' | 'concise'>('optimized')

  const getActivePrompt = () => {
    switch (activeVariant) {
      case 'optimized':
        return result.optimized_prompt
      case 'creative':
        return result.variants.creative
      case 'technical':
        return result.variants.technical
      case 'concise':
        return result.variants.concise
      default:
        return result.optimized_prompt
    }
  }

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-700/30">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-300">Enhancement Score</h3>
              <p className="text-3xl font-bold text-white">{result.score}/10</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Quality Rating</p>
              <div className="flex items-center space-x-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-4 rounded ${
                      i < Math.floor(result.score) 
                        ? 'bg-green-500' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Optimized Prompt Card */}
      <Card className="bg-gray-800/50 border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Optimized Prompt</h3>
            <CopyButton text={getActivePrompt()} />
          </div>
          
          <VariantsTabs 
            activeVariant={activeVariant}
            onVariantChange={setActiveVariant}
          />
          
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-gray-200 whitespace-pre-wrap">{getActivePrompt()}</p>
          </div>
        </div>
      </Card>

      {/* Explanation Card */}
      <Card className="bg-gray-800/50 border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Enhancement Explanation</h3>
          <p className="text-gray-300 leading-relaxed">{result.explanation}</p>
        </div>
      </Card>
    </div>
  )
}
```

### Variants Tabs Component (`frontend/components/variants-tabs.tsx`)

```tsx
'use client'

import { Button } from '@/components/ui/button'

interface VariantsTabsProps {
  activeVariant: 'optimized' | 'creative' | 'technical' | 'concise'
  onVariantChange: (variant: 'optimized' | 'creative' | 'technical' | 'concise') => void
}

export default function VariantsTabs({ activeVariant, onVariantChange }: VariantsTabsProps) {
  const variants = [
    { id: 'optimized' as const, label: 'Optimized', icon: '✨' },
    { id: 'creative' as const, label: 'Creative', icon: '🎨' },
    { id: 'technical' as const, label: 'Technical', icon: '⚙️' },
    { id: 'concise' as const, label: 'Concise', icon: '📝' },
  ]

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {variants.map((variant) => (
        <Button
          key={variant.id}
          variant={activeVariant === variant.id ? 'default' : 'outline'}
          onClick={() => onVariantChange(variant.id)}
          className="flex items-center space-x-2 whitespace-nowrap"
        >
          <span>{variant.icon}</span>
          <span>{variant.label}</span>
        </Button>
      ))}
    </div>
  )
}
```

### Loader Component (`frontend/components/loader.tsx`)

```tsx
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin opacity-50"></div>
      </div>
      <p className="mt-4 text-gray-400">Enhancing your prompt...</p>
    </div>
  )
}
```

### Copy Button Component (`frontend/components/copy-button.tsx`)

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      {copied ? (
        <>
          <span>✅</span>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <span>📋</span>
          <span>Copy</span>
        </>
      )}
    </Button>
  )
}
```

## 🔧 UI Components (`frontend/components/ui/`)

### Button Component (`frontend/components/ui/button.tsx`)

```tsx
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none'
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800',
    ghost: 'text-gray-300 hover:bg-gray-800'
  }
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
```

### Card Component (`frontend/components/ui/card.tsx`)

```tsx
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  )
}
```

### Textarea Component (`frontend/components/ui/textarea.tsx`)

```tsx
import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = (props) => {
  return (
    <textarea
      {...props}
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className}`}
    />
  )
}
```

## 📡 API Integration (`frontend/lib/api.ts`)

```tsx
import { EnhanceRequest, EnhanceResponse } from '@/types/enhancement'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL
  }

  async enhancePrompt(request: EnhanceRequest): Promise<EnhanceResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/api/v1/health`)
    return response.json()
  }
}

export const apiClient = new ApiClient()
```

## 📋 Type Definitions (`frontend/types/enhancement.ts`)

```tsx
export interface EnhanceRequest {
  prompt: string
  mode: 'basic' | 'detailed' | 'creative'
}

export interface EnhanceResponse {
  optimized_prompt: string
  score: number
  explanation: string
  variants: {
    creative: string
    technical: string
    concise: string
  }
}
```

## 🎨 Global Styles (`frontend/app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 15, 23, 42;
  --background-end-rgb: 3, 7, 18;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
    to bottom right,
    rgb(var(--background-start-rgb)),
    rgb(var(--background-end-rgb))
  );
  min-height: 100vh;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
```

This frontend implementation provides a modern, responsive interface with proper state management, error handling, and a clean user experience for the PromptForge AI application.