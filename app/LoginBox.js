'use client'

import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function LoginBox() {
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
        emailRedirectTo: window.location.origin,
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
    <>
      <LoginBoxSimple />
  
      <div style={{ marginBottom: '16px' }}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>
        {loading ? 'Sending...' : 'Login'}
      </button>
    </div>
  )
}