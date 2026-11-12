import { useEffect, useState } from 'react'
import { apiGet } from './api'

function App() {
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGet('').then(setData).catch((e: Error) => setError(e.message))
  }, [])

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">Fullstack Interview</h1>
      {error && <p className="text-red-600">{error}</p>}
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  )
}

export default App