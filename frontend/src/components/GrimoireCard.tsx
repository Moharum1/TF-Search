import type { MouseEvent } from 'react'
import type { GrimoireEntry } from '../types/grimoire'

interface GrimoireCardProps {
  entry: GrimoireEntry
  index: number
  onSelect: (x: number, y: number) => void
}

export function GrimoireCard({ entry, index, onSelect }: GrimoireCardProps) {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onSelect(e.clientX, e.clientY)
  }

  return (
    <article
      className="grimoire-card"
      style={{ animationDelay: `${index * 0.1 + 0.12}s` }}
      onClick={handleClick}
    >
      <div className="card-header">
        <span className="card-category">{entry.category}</span>
        <span className="card-era">{entry.era}</span>
      </div>
      <h2 className="card-title">{entry.title}</h2>
      <p className="card-excerpt">{entry.excerpt}</p>
      <div className="card-footer">
        <span>✦ Open Manuscript</span>
      </div>
    </article>
  )
}
