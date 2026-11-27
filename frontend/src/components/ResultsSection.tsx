import type { SearchResultItem } from '../types/grimoire'
import { GrimoireCard } from './GrimoireCard'

interface ResultsSectionProps {
  activeQuery: string
  results: SearchResultItem[]
  total: number
  elapsedSeconds: string
  castCount: number
  isLoading: boolean
  error: string | null
  onCardClick: (x: number, y: number) => void
}

export function ResultsSection({
  activeQuery,
  results,
  total,
  elapsedSeconds,
  castCount,
  isLoading,
  error,
  onCardClick,
}: ResultsSectionProps) {
  const maxScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0

  const countLabel = isLoading
    ? `Seeking manuscripts for "${activeQuery}"…`
    : `${total} ${total === 1 ? 'document' : 'documents'} matched for "${activeQuery}"`

  return (
    <section className="results-section" aria-live="polite">
      <div className="results-meta">
        <span>{activeQuery ? countLabel : '0 documents found'}</span>
        <span>{isLoading ? 'Channeling…' : `Channeled in ${elapsedSeconds}s`}</span>
      </div>

      {error && (
        <div className="results-state results-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!error && !isLoading && activeQuery && results.length === 0 && (
        <div className="results-state">
          <p>No indexed documents matched &ldquo;{activeQuery}&rdquo;.</p>
        </div>
      )}

      {!error && results.length > 0 && (
        <div className="results-list">
          {results.map((item, index) => (
            <GrimoireCard
              key={`${castCount}-${item.title}-${index}`}
              item={item}
              index={index}
              maxScore={maxScore}
              onSelect={onCardClick}
            />
          ))}
        </div>
      )}
    </section>
  )
}
