import type { GrimoireEntry } from '../types/grimoire'
import { GrimoireCard } from './GrimoireCard'

interface ResultsSectionProps {
  activeQuery: string
  results: GrimoireEntry[]
  elapsedSeconds: string
  castCount: number
  onCardClick: (x: number, y: number) => void
}

export function ResultsSection({
  activeQuery,
  results,
  elapsedSeconds,
  castCount,
  onCardClick,
}: ResultsSectionProps) {
  const countLabel = `${results.length} ${results.length === 1 ? 'manuscript' : 'manuscripts'} uncovered for "${activeQuery}"`

  return (
    <section className="results-section" aria-live="polite">
      <div className="results-meta">
        <span>{activeQuery ? countLabel : '0 manuscripts found'}</span>
        <span>Channeled in {elapsedSeconds}s</span>
      </div>
      <div className="results-list">
        {results.map((entry, index) => (
          <GrimoireCard
            key={`${castCount}-${entry.id}`}
            entry={entry}
            index={index}
            onSelect={onCardClick}
          />
        ))}
      </div>
    </section>
  )
}
