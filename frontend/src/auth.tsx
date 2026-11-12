import { useState, type SubmitEvent } from 'react'
import { login, register } from './api'
import type { User } from './types'

type Mode = 'login' | 'register'

type AuthPageProps = {
  onAuthenticated: (user: User) => void
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      // register() doesn't start a session, so always log in afterwards
      if (mode === 'register') await register(email, password)
      onAuthenticated(await login(email, password))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <h2 className="text-xl font-semibold">
        {mode === 'login' ? 'Log in' : 'Register'}
      </h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
      />

      {error && <p className="text-red-600 whitespace-pre-line">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {mode === 'login' ? 'Log in' : 'Create account'}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="text-sm underline"
      >
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Log in'}
      </button>
    </form>
  )
}
