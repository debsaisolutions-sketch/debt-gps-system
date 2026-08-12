'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from './lib/supabase/browser'
import { recordCalculatorLoginLead } from './lib/recordCalculatorLoginLead'

export default function LoginBoxSimple({
  redirectTo = '/calculator',
  onSent = null,
  compact = false
} = {}) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    if (!email) {
      setMessage('Enter your email')
      return
    }

    setLoading(true)
    setMessage('')

    const supabase = createBrowserSupabaseClient()
    const next = redirectTo.startsWith('/') ? redirectTo : '/calculator'
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
      },
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    try {
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
