import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [mode, setMode] = useState('sign_in') // 'sign_in' | 'sign_up'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'sign_in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage({ type: 'error', text: error.message })
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'Account created. Check your email to confirm, then sign in.',
        })
      }
    }
    setLoading(false)
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-mark">VAULT</div>
        <h1>{mode === 'sign_in' ? 'Sign in' : 'Create your account'}</h1>
        <p className="auth-sub">
          {mode === 'sign_in'
            ? 'Access your stored logins.'
            : 'This will be the only account with access to your vault.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Working…' : mode === 'sign_in' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {message && <div className={`auth-message ${message.type}`}>{message.text}</div>}

        <button
          className="link-btn"
          onClick={() => {
            setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in')
            setMessage(null)
          }}
        >
          {mode === 'sign_in' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
