'use client'

import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function LoginBoxSimple() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email) {
      alert('Enter your email')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Check your email for your login link')
  }

  return (
    <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: '10px 12px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          minWidth: '260px'
        }}
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Sending...' : 'Login'}
      </button>
    </div>
  )
}
