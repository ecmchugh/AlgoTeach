import { useEffect, useState } from 'react'

function App() {
  const [problems, setProblems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
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
  const hasAnswered = selected !== null
  const isCorrect = selected === problem.pattern

  function handleNext() {
    setSelected(null)
    setCurrentIndex((prev) => (prev + 1) % problems.length)
  }

  return (
    <div>
      <h1>AlgoTeach</h1>
      <p>Problem {currentIndex + 1} of {problems.length}</p>
      <h2>{problem.title}</h2>
      <p>{problem.prompt}</p>
      <div>
        {problem.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => setSelected(choice)}
            disabled={hasAnswered}
          >
            {choice}
          </button>
        ))}
      </div>

      {hasAnswered && (
        <div>
          <p>
            {isCorrect
              ? 'Correct!'
              : `Not quite. The answer is: ${problem.pattern}`}
          </p>
          <p><strong>Why:</strong> {problem.explanation}</p>
          <p><strong>Clues:</strong></p>
          <ul>
            {problem.clues.map((clue) => <li key={clue}>{clue}</li>)}
          </ul>
          <p><strong>Complexity:</strong> {problem.complexity}</p>
          <button onClick={handleNext}>Next problem</button>
        </div>
      )}
    </div>
  )
}

export default App
