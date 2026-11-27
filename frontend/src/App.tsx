import { useCallback, useEffect, useRef, useState } from 'react'
import { searchDocuments } from './api/searchApi'
import { BottomWhisper } from './components/BottomWhisper'
import { HeroHeader } from './components/HeroHeader'
import { ManaCanvas } from './components/ManaCanvas'
import { ResultsSection } from './components/ResultsSection'
import { SearchBar } from './components/SearchBar'
import { TopBar } from './components/TopBar'
import { UploadPage } from './components/UploadPage'
import { QUICK_SUGGESTIONS } from './data/grimoireArchive'
import { useTheme } from './hooks/useTheme'
import type { ManaCanvasHandle, PageView, SearchResultItem } from './types/grimoire'

export default function App() {
  const { theme, toggleTheme } = useTheme('twilight')
  const canvasRef = useRef<ManaCanvasHandle | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const [activePage, setActivePage] = useState<PageView>('search')
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [total, setTotal] = useState(0)
  const [hasResults, setHasResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState('0.00')
  const [castCount, setCastCount] = useState(0)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const handleQueryChange = useCallback(
    (value: string, sparkCoords?: { x: number; y: number }) => {
      setQuery(value)
      if (sparkCoords) {
        canvasRef.current?.spawnSpark(sparkCoords.x, sparkCoords.y)
      }
    },
    [],
  )

  const handleSearch = useCallback(
    async (searchTerm: string, origin?: { x: number; y: number }) => {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setQuery(searchTerm)
      setActiveQuery(searchTerm)
      setHasResults(true)
      setIsLoading(true)
      setError(null)
      setCastCount((prev) => prev + 1)

      if (origin) {
        canvasRef.current?.spawnBurst(origin.x, origin.y, 24, 'petal')
      }

      const start = performance.now()
      try {
        const data = await searchDocuments(searchTerm, { signal: controller.signal })
        const elapsed = ((performance.now() - start) / 1000).toFixed(3)

        setResults(data.results)
        setTotal(data.total)
        setElapsedSeconds(elapsed)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        setResults([])
        setTotal(0)
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to reach the TF-IDF search backend.',
        )
      } finally {
        if (abortControllerRef.current === controller) {
          setIsLoading(false)
        }
      }
    },
    [],
  )

  const handleResetHome = useCallback(() => {
    abortControllerRef.current?.abort()
    setHasResults(false)
    setQuery('')
    setActiveQuery('')
    setResults([])
    setTotal(0)
    setError(null)
    setIsLoading(false)
  }, [])

  const handleCardClick = useCallback((x: number, y: number) => {
    canvasRef.current?.spawnBurst(x, y, 12, 'petal')
  }, [])

  const handleUploadBurst = useCallback((x: number, y: number) => {
    canvasRef.current?.spawnBurst(x, y, 28, 'petal')
  }, [])

  const handleCastFlowerField = useCallback(() => {
    canvasRef.current?.castFlowerField()
  }, [])

  return (
    <div className={`app-shell${activePage === 'search' && hasResults ? ' has-results' : ''}`}>
      <ManaCanvas ref={canvasRef} />
      <TopBar
        theme={theme}
        activePage={activePage}
        onToggleTheme={toggleTheme}
        onNavigate={setActivePage}
      />

      {activePage === 'upload' ? (
        <UploadPage
          onSuccessBurst={handleUploadBurst}
          onGoToSearch={() => setActivePage('search')}
        />
      ) : (
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
            total={total}
            elapsedSeconds={elapsedSeconds}
            castCount={castCount}
            isLoading={isLoading}
            error={error}
            onCardClick={handleCardClick}
          />
        </main>
      )}

      <BottomWhisper onCastFlowerField={handleCastFlowerField} />
    </div>
  )
}
