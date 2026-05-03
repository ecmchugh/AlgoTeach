import { useEffect, useState } from 'react'

function App() {
  const [problems, setProblems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:4000/api/problems')
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return <p>Error: {error}</p>
  }

  if (problems.length === 0) {
    return <p>Loading...</p>
  }

  const problem = problems[currentIndex]

  return (
    <div>
      <h1>AlgoTeach</h1>
      <h2>{problem.title}</h2>
      <p>{problem.prompt}</p>
      <div>
        {problem.choices.map((choice) => (
          <button key={choice}>{choice}</button>
        ))}
      </div>
    </div>
  )
}

export default App
