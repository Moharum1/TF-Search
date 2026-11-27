import type { MouseEvent } from 'react'
import type { SearchResultItem } from '../types/grimoire'

interface GrimoireCardProps {
  item: SearchResultItem
  index: number
  maxScore: number
  onSelect: (x: number, y: number) => void
}

export function GrimoireCard({ item, index, maxScore, onSelect }: GrimoireCardProps) {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onSelect(e.clientX, e.clientY)
  }

  const relativePercent = maxScore > 0 ? Math.min(100, (item.score / maxScore) * 100) : 0

  return (
    <article
      className="grimoire-card"
      style={{ animationDelay: `${index * 0.08 + 0.08}s` }}
      onClick={handleClick}
    >
      <div className="card-row">
        <div className="card-identity">
          <span className="card-rank">#{index + 1}</span>
          <h2 className="card-title">{item.title}</h2>
        </div>

        <div className="score-badge" title={`TF-IDF Score: ${item.score}`}>
          <span className="score-label">TF-IDF</span>
          <span className="score-value">{item.score.toFixed(4)}</span>
        </div>
      </div>

      <div className="score-bar-track" aria-hidden="true">
        <div className="score-bar-fill" style={{ width: `${relativePercent}%` }} />
      </div>
    </article>
  )
}
