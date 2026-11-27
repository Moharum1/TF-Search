import { useCallback, useRef, useState } from 'react'
import { BottomWhisper } from './components/BottomWhisper'
import { HeroHeader } from './components/HeroHeader'
import { ManaCanvas } from './components/ManaCanvas'
import { ResultsSection } from './components/ResultsSection'
import { SearchBar } from './components/SearchBar'
import { TopBar } from './components/TopBar'
import { QUICK_SUGGESTIONS, searchGrimoireArchive } from './data/grimoireArchive'
import { useTheme } from './hooks/useTheme'
import type { GrimoireEntry, ManaCanvasHandle } from './types/grimoire'

export default function App() {
  const { theme, toggleTheme } = useTheme('twilight')
  const canvasRef = useRef<ManaCanvasHandle | null>(null)

  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [results, setResults] = useState<GrimoireEntry[]>([])
  const [hasResults, setHasResults] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState('0.04')
  const [castCount, setCastCount] = useState(0)

  const handleQueryChange = useCallback(
    (value: string, sparkCoords?: { x: number; y: number }) => {
      setQuery(value)
      if (sparkCoords) {
        canvasRef.current?.spawnSpark(sparkCoords.x, sparkCoords.y)
      }
    },
    [],
  )

  const handleSearch = useCallback((searchTerm: string, origin?: { x: number; y: number }) => {
    const start = performance.now()
    const matches = searchGrimoireArchive(searchTerm)
    const elapsed = Math.max((performance.now() - start) / 1000, 0.02).toFixed(2)

    setQuery(searchTerm)
    setActiveQuery(searchTerm)
    setResults(matches)
    setElapsedSeconds(elapsed)
    setHasResults(true)
    setCastCount((prev) => prev + 1)

    if (origin) {
      canvasRef.current?.spawnBurst(origin.x, origin.y, 24, 'petal')
    }
  }, [])

  const handleResetHome = useCallback(() => {
    setHasResults(false)
    setQuery('')
    setActiveQuery('')
    setResults([])
  }, [])

  const handleCardClick = useCallback((x: number, y: number) => {
    canvasRef.current?.spawnBurst(x, y, 12, 'petal')
  }, [])

  const handleCastFlowerField = useCallback(() => {
    canvasRef.current?.castFlowerField()
  }, [])

  return (
    <div className={`app-shell${hasResults ? ' has-results' : ''}`}>
      <ManaCanvas ref={canvasRef} />
      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      <main className="stage">
        <HeroHeader onReset={handleResetHome} />
        <SearchBar
          query={query}
          castCount={castCount}
          suggestions={QUICK_SUGGESTIONS}
          onQueryChange={handleQueryChange}
          onSearch={handleSearch}
          onClear={() => setQuery('')}
        />
        <ResultsSection
          activeQuery={activeQuery}
          results={results}
          elapsedSeconds={elapsedSeconds}
          castCount={castCount}
          onCardClick={handleCardClick}
        />
      </main>

      <BottomWhisper onCastFlowerField={handleCastFlowerField} />
    </div>
  )
}
