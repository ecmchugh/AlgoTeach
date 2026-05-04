import { useEffect, useState } from 'react'

const RECHECK_DELAY = 3

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function App() {
  const [problems, setProblems] = useState([])
  const [queue, setQueue] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)
  const [deeperExplanation, setDeeperExplanation] = useState(null)
  const [loadingDeeper, setLoadingDeeper] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:4000/api/problems')
      .then((res) => res.json())
      .then((data) => {
        setProblems(data)
        setQueue(shuffle(data))
      })
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  const masteredCount = problems.length - queue.length
  const progressPct = (masteredCount / problems.length) * 100
  const finished = queue.length === 0

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">AlgoTeach</h1>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
            </div>
          </header>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All done!</h2>
            <p className="text-slate-600 mb-6">
              You mastered all {problems.length} problems.
            </p>
            <button
              onClick={() => {
                setQueue(shuffle(problems))
                setSelected(null)
                setDeeperExplanation(null)
                setLoadingDeeper(false)
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    )
  }

  const problem = queue[0]
  const hasAnswered = selected !== null
  const isCorrect = selected === problem.pattern

  function handleNext() {
    const wasCorrect = selected === problem.pattern
    setSelected(null)
    setDeeperExplanation(null)
    setLoadingDeeper(false)

    setQueue((prev) => {
      const [current, ...rest] = prev
      if (wasCorrect) {
        return rest
      }
      const insertAt = Math.min(RECHECK_DELAY, rest.length)
      return [...rest.slice(0, insertAt), current, ...rest.slice(insertAt)]
    })
  }

  function handleExplainDeeper() {
    setLoadingDeeper(true)
    fetch(`http://127.0.0.1:4000/api/problems/${problem.id}/explain-deeper`)
      .then((res) => res.json())
      .then((data) => {
        setDeeperExplanation(data.explanation)
        setLoadingDeeper(false)
      })
      .catch((err) => {
        setDeeperExplanation(`Error: ${err.message}`)
        setLoadingDeeper(false)
      })
  }

  function choiceClass(choice) {
    const base = 'text-left px-4 py-3 rounded-lg border-2 transition'
    if (!hasAnswered) {
      return `${base} border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer`
    }
    if (choice === problem.pattern) {
      return `${base} border-emerald-500 bg-emerald-50 text-emerald-900 font-medium`
    }
    if (choice === selected) {
      return `${base} border-red-500 bg-red-50 text-red-900`
    }
    return `${base} border-slate-200 bg-slate-50 text-slate-400`
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">AlgoTeach</h1>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {masteredCount} of {problems.length} mastered
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            {problem.title}
          </h2>
          <p className="text-slate-700 mb-6 leading-relaxed">{problem.prompt}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {problem.choices.map((choice) => (
              <button
                key={choice}
                onClick={() => setSelected(choice)}
                disabled={hasAnswered}
                className={choiceClass(choice)}
              >
                {choice}
              </button>
            ))}
          </div>

          {hasAnswered && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p
                className={`text-lg font-semibold mb-1 ${
                  isCorrect ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {isCorrect
                  ? 'Correct!'
                  : `Not quite. The answer is: ${problem.pattern}`}
              </p>
              {!isCorrect && (
                <p className="text-sm text-slate-500 mb-4">
                  We'll show this one again in a few problems.
                </p>
              )}
              {isCorrect && <div className="mb-4" />}

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Why</p>
                  <p className="text-slate-700">{problem.explanation}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Clues</p>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    {problem.clues.map((clue) => (
                      <li key={clue}>{clue}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Complexity
                  </p>
                  <p className="text-slate-700 font-mono text-sm">
                    {problem.complexity}
                  </p>
                </div>
              </div>

              {!deeperExplanation && (
                <button
                  onClick={handleExplainDeeper}
                  disabled={loadingDeeper}
                  className="px-4 py-2 text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {loadingDeeper ? 'Thinking...' : 'Get deeper explanation'}
                </button>
              )}

              {deeperExplanation && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-indigo-900 mb-2">
                    AI explanation
                  </p>
                  <p className="text-slate-700">{deeperExplanation}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Next problem
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
