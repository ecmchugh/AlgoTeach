import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    fetch('http://127.0.0.1:4000/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.ok ? 'OK' : 'not OK'))
      .catch((err) => setStatus(`error: ${err.message}`))
  }, [])

  return (
    <div>
      <h1>AlgoTeach</h1>
      <p>Backend says: {status}</p>
    </div>
  )
}

export default App
