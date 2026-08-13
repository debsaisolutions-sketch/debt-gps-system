'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from './lib/supabase/browser'
import { recordCalculatorLoginLead } from './lib/recordCalculatorLoginLead'

export default function LoginBoxSimple({
  redirectTo = '/calculator',
  onSent = null,
  compact = false,
  initialEmail = ''
} = {}) {
  const [email, setEmail] = useState(() => String(initialEmail || '').trim())
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Carry over email already typed in the free unlock field on this visit.
  useEffect(() => {
    const next = String(initialEmail || '').trim()
    if (!next) return
    setEmail((prev) => (String(prev || '').trim() ? prev : next))
  }, [initialEmail])

  const handleLogin = async () => {
    if (!email) {
      setMessage('Enter your email')
      return
    }

    setLoading(true)
    setMessage('')

    const next = redirectTo.startsWith('/') ? redirectTo : '/calculator'
    const sendRes = await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, next }),
    })
    const sendData = await sendRes.json().catch(() => ({}))

    setLoading(false)

    if (!sendRes.ok) {
      setMessage(sendData.error || 'Could not send login link')
      return
    }

    try {
      const supabase = createBrowserSupabaseClient()
      await recordCalculatorLoginLead(supabase, email)
    } catch (err) {
      console.warn('[leads] record after OTP failed', err)
    }

    const okMsg = 'Check your email for your login link'
    setMessage(okMsg)
    if (typeof onSent === 'function') onSent(email)
  }

  return (
    <div
      style={{
        marginBottom: compact ? '8px' : '20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: '10px 12px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          minWidth: compact ? '200px' : '260px'
        }}
      />
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="primary-button"
        style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Sending...' : 'Email me a login link'}
      </button>
      {message ? (
        <p className="help tight" style={{ margin: 0, width: '100%' }}>
          {message}
        </p>
      ) : null}
    </div>
  )
}
