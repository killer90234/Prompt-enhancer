'use client'

import { useState } from 'react'
import PromptInput from '../components/prompt-input'
import ResultCard from '../components/result-card'
import AuthGuard from '../components/auth-guard'
import { useAuth } from '../lib/auth-context'
import { EnhancementResponse, EnhancementMode } from '../types/api'

function HomeContent() {
  const { user, profile, promptsRemaining, logout, incrementPromptUsage, error: authError, clearError } = useAuth()
  const [result, setResult] = useState<EnhancementResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async (prompt: string, mode: EnhancementMode) => {
    // Check rate limit before making API call
    const canProceed = await incrementPromptUsage();
    if (!canProceed) return;

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

  const planLimits: Record<string, { label: string; prompts: string; price: string }> = {
    free: { label: 'Free', prompts: '5/day', price: '₹0' },
    basic: { label: 'Basic', prompts: '30/day', price: '₹149/mo' },
    premium: { label: 'Premium', prompts: '150/day', price: '₹399/mo' },
    max: { label: 'Max', prompts: 'Unlimited', price: '₹799/mo' },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] bg-gray-950/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Prompt<span className="text-indigo-400">Forge</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-white/[0.06] rounded-lg">
                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-indigo-400 text-xs font-bold uppercase">
                  {profile.plan}
                </span>
                <span className="text-xs text-gray-500">|</span>
                <span className={`text-xs font-medium ${promptsRemaining === 0 ? 'text-red-400' : promptsRemaining === Infinity ? 'text-cyan-400' : 'text-gray-300'}`}>
                  {promptsRemaining === Infinity ? 'Unlimited' : `${promptsRemaining} left`}
                </span>
              </div>
            )}
            <a
              href="https://inforium-alliance.netlify.app/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all"
            >
              Upgrade Plan
            </a>
            <span className="text-xs text-gray-500">{user?.email}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Current Plan Card */}
        {profile && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/[0.08] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs text-gray-500 block">Current Plan</span>
                  <span className="text-sm font-bold text-white capitalize">{profile.plan}</span>
                </div>
                <div className="w-px h-8 bg-white/[0.06]"></div>
                <div>
                  <span className="text-xs text-gray-500 block">Prompts</span>
                  <span className="text-sm font-medium text-gray-300">{planLimits[profile.plan]?.prompts}</span>
                </div>
                <div className="w-px h-8 bg-white/[0.06]"></div>
                <div>
                  <span className="text-xs text-gray-500 block">Price</span>
                  <span className="text-sm font-medium text-gray-300">{planLimits[profile.plan]?.price}</span>
                </div>
              </div>
              {profile.plan !== 'max' && (
                <a
                  href="https://inforium-alliance.netlify.app/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Need more? Upgrade &rarr;
                </a>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Enhance Your Prompts
          </h2>
          <p className="text-gray-400">
            AI-powered prompt optimization to get better results
          </p>
        </div>

        {/* Rate limit warning */}
        {authError && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between">
            <p className="text-amber-400 text-sm">{authError}</p>
            <div className="flex items-center gap-3">
              <a
                href="https://inforium-alliance.netlify.app/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                Upgrade Plan
              </a>
              <button onClick={clearError} className="text-amber-500 hover:text-amber-300 text-sm">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <PromptInput
            onEnhance={handleEnhance}
            loading={loading}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 animate-fade-in">
              <ResultCard result={result} />
            </div>
          )}
        </div>

        {/* Plans Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider text-center mb-4">All Plans</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(planLimits).map(([key, plan]) => (
              <div
                key={key}
                className={`relative p-4 rounded-xl border transition-all ${
                  profile?.plan === key
                    ? 'bg-indigo-500/10 border-indigo-500/30'
                    : 'bg-gray-900/40 border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {profile?.plan === key && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase">
                    Current
                  </span>
                )}
                <p className="text-sm font-bold text-white capitalize">{plan.label}</p>
                <p className="text-lg font-bold text-indigo-400 mt-1">{plan.prompts}</p>
                <p className="text-xs text-gray-500 mt-1">{plan.price}</p>
                {profile?.plan !== key && key !== 'free' && (
                  <a
                    href="https://inforium-alliance.netlify.app/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-center text-xs font-medium text-indigo-400 hover:text-indigo-300 py-1.5 border border-indigo-500/20 rounded-lg transition-colors"
                  >
                    Upgrade
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Powered by Inforium Alliance</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  )
}
