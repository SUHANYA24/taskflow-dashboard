import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    if (isSignUp) {
      const { error } =
        await supabase.auth.signUp({
          email,
          password,
        })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage(
          'Account created. Check your email if confirmation is required.',
        )
      }
    } else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Login successful.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">T</div>

          <div>
            <h1>TaskFlow</h1>
            <p className="muted">
              Manage projects. Track progress.
            </p>
          </div>
        </div>

        <div className="auth-heading">
          <h2>
            {isSignUp
              ? 'Create your account'
              : 'Welcome back'}
          </h2>

          <p className="muted">
            {isSignUp
              ? 'Sign up to start managing your work.'
              : 'Sign in to continue to your workspace.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <button
            className="primary-btn auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isSignUp
              ? 'Create account'
              : 'Sign in'}
          </button>
        </form>

        <div className="auth-switch">
          <span className="muted">
            {isSignUp
              ? 'Already have an account?'
              : "Don't have an account?"}
          </span>

          <button
            type="button"
            className="text-btn"
            onClick={() => {
              setIsSignUp(
                (current) => !current,
              )
              setMessage('')
            }}
          >
            {isSignUp
              ? 'Sign in'
              : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  )
}