import { useEffect, useState } from 'react'

const API_BASE = 'http://127.0.0.1:4000'
const RECHECK_DELAY = 3

const PRACTICE_PROMPTS = [
  {
    pattern: 'Sliding Window',
    title: 'Maximum Subarray Sum of Size K',
    description:
      'Write a function that takes an array of integers and an integer k, and returns the maximum sum of any contiguous subarray of length k.',
    starter: 'def max_sum(arr, k):\n    pass\n',
  },
  {
    pattern: 'Sliding Window',
    title: 'Longest Substring with K Distinct Characters',
    description:
      'Write a function that takes a string and an integer k, and returns the length of the longest substring containing at most k distinct characters.',
    starter: 'def longest_substring(s, k):\n    pass\n',
  },
  {
    pattern: 'Sliding Window',
    title: 'Smallest Subarray With Given Sum',
    description:
      'Write a function that takes an array of positive integers and a target sum, and returns the length of the smallest contiguous subarray whose sum is greater than or equal to the target. Return 0 if no such subarray exists.',
    starter: 'def smallest_subarray(arr, target):\n    pass\n',
  },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getSessionId() {
  let id = localStorage.getItem('algoteach-session-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('algoteach-session-id', id)
  }
  return id
}

function StatsCard({ stats }) {
  if (!stats || stats.total_attempts === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-8">
        <h3 className="font-semibold text-slate-900 mb-2">Your Stats</h3>
        <p className="text-sm text-slate-500">Answer problems to see your stats.</p>
      </div>
    )
  }

  const successRate = Math.round((stats.total_correct / stats.total_attempts) * 100)
  const weakest = stats.by_pattern.slice(0, 3)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-8">
      <h3 className="font-semibold text-slate-900 mb-4">Your Stats</h3>

      <div className="mb-5">
        <p className="text-sm text-slate-500 mb-1">Overall</p>
        <p className="text-2xl font-bold text-slate-900">
          {stats.total_correct} / {stats.total_attempts}
        </p>
        <p className="text-sm text-slate-600">{successRate}% correct</p>
      </div>

      {weakest.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">
            Weakest patterns
          </p>
          <ul className="space-y-2">
            {weakest.map((p) => (
              <li key={p.pattern} className="flex justify-between text-sm">
                <span className="text-slate-700">{p.pattern}</span>
                <span className="text-slate-500 font-mono">
                  {p.correct}/{p.total}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PracticeMode() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [code, setCode] = useState(PRACTICE_PROMPTS[0].starter)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  const current = PRACTICE_PROMPTS[promptIndex]

  function handleSubmit() {
    setLoading(true)
    setFeedback(null)
    fetch(`${API_BASE}/api/evaluate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pattern: current.pattern,
        prompt: current.description,
        code: code,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setFeedback(data.feedback)
        setLoading(false)
      })
      .catch((err) => {
        setFeedback(`Error: ${err.message}`)
        setLoading(false)
      })
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4
      }, 0)
    }
  }

  function nextPrompt() {
    const next = (promptIndex + 1) % PRACTICE_PROMPTS.length
    setPromptIndex(next)
    setCode(PRACTICE_PROMPTS[next].starter)
    setFeedback(null)
  }

  function resetCode() {
    setCode(current.starter)
    setFeedback(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <p className="text-sm font-medium text-indigo-600 mb-1">
        Practice · {current.pattern}
      </p>
      <h2 className="text-xl font-semibold text-slate-900 mb-3">
        {current.title}
      </h2>
      <p className="text-slate-700 mb-5 leading-relaxed">
        {current.description}
      </p>

      <label className="text-sm font-medium text-slate-500 mb-2 block">
        Your code
      </label>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={14}
        spellCheck={false}
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg font-mono text-sm focus:border-indigo-400 focus:outline-none resize-y"
      />

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Checking...' : 'Check my code'}
        </button>
        <button
          onClick={resetCode}
          className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
        >
          Reset
        </button>
        <button
          onClick={nextPrompt}
          className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition ml-auto"
        >
          Try another →
        </button>
      </div>

      {feedback && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-2">AI feedback</p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
            {feedback}
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [mode, setMode] = useState('quiz')
  const [problems, setProblems] = useState([])
  const [queue, setQueue] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)
  const [deeperExplanation, setDeeperExplanation] = useState(null)
  const [loadingDeeper, setLoadingDeeper] = useState(false)
  const [stats, setStats] = useState(null)
  const [sessionId] = useState(() => getSessionId())

  useEffect(() => {
    fetch(`${API_BASE}/api/problems`)
      .then((res) => res.json())
      .then((data) => {
        setProblems(data)
        setQueue(shuffle(data))
      })
      .catch((err) => setError(err.message))

    fetchStats()
  }, [])

  function fetchStats() {
    fetch(`${API_BASE}/api/stats?session=${sessionId}`)
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
  }

  function handleSelect(choice) {
    setSelected(choice)
    fetch(`${API_BASE}/api/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        problem_id: problem.id,
        selected: choice,
      }),
    })
      .then(() => fetchStats())
      .catch(console.error)
  }

  function tabClass(value) {
    const base = 'px-4 py-2 rounded-lg text-sm font-medium transition'
    if (mode === value) {
      return `${base} bg-indigo-600 text-white`
    }
    return `${base} bg-white border border-slate-200 text-slate-700 hover:bg-slate-50`
  }

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

  const renderHeader = () => (
    <header className="mb-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-3">AlgoTeach</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('quiz')} className={tabClass('quiz')}>
          Quiz
        </button>
        <button
          onClick={() => setMode('practice')}
          className={tabClass('practice')}
        >
          Practice
        </button>
      </div>
      {mode === 'quiz' && (
        <>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                finished ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${finished ? 100 : progressPct}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {masteredCount} of {problems.length} mastered
          </p>
        </>
      )}
    </header>
  )

  if (mode === 'practice') {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {renderHeader()}
          <PracticeMode />
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {renderHeader()}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  All done!
                </h2>
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
            <div>
              <StatsCard stats={stats} />
            </div>
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
    fetch(`${API_BASE}/api/problems/${problem.id}/explain-deeper`)
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
      <div className="max-w-5xl mx-auto">
        {renderHeader()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                {problem.title}
              </h2>
              <p className="text-slate-700 mb-6 leading-relaxed">
                {problem.prompt}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {problem.choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleSelect(choice)}
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
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Why
                      </p>
                      <p className="text-slate-700">{problem.explanation}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Clues
                      </p>
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
                      {loadingDeeper
                        ? 'Thinking...'
                        : 'Get deeper explanation'}
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

          <div>
            <StatsCard stats={stats} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
