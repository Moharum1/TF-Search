import { useRef, type FormEvent } from 'react'
import type { SearchSuggestion } from '../types/grimoire'
import { MagicCircle } from './MagicCircle'

interface SearchBarProps {
  query: string
  castCount: number
  suggestions: SearchSuggestion[]
  onQueryChange: (value: string, sparkCoords?: { x: number; y: number }) => void
  onSearch: (query: string, origin?: { x: number; y: number }) => void
  onClear: () => void
}

export function SearchBar({
  query,
  castCount,
  suggestions,
  onQueryChange,
  onSearch,
  onClear,
}: SearchBarProps) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const getFormCenter = () => {
    const rect = formRef.current?.getBoundingClientRect()
    if (!rect) return undefined
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      inputRef.current?.focus()
      return
    }
    onSearch(trimmed, getFormCenter())
  }

  const handleInputChange = (value: string) => {
    const rect = formRef.current?.getBoundingClientRect()
    const sparkCoords = rect
      ? {
          x: rect.left + 40 + Math.random() * Math.max(rect.width - 120, 40),
          y: rect.top + rect.height / 2,
        }
      : undefined
    onQueryChange(value, sparkCoords)
  }

  const handleClear = () => {
    onClear()
    inputRef.current?.focus()
  }

  return (
    <section className="search-sanctuary">
      <MagicCircle castCount={castCount} />

      <form ref={formRef} className="search-form" autoComplete="off" onSubmit={handleSubmit}>
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7.5" />
          <path d="M20 20l-3.8-3.8" />
          <path d="M11 7.5v7M7.5 11h7" opacity="0.55" strokeWidth="1.2" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search spells, forgotten places, or grimoires…"
          aria-label="Search the grimoire"
        />

        <button
          type="button"
          className={`clear-btn${query.length > 0 ? ' visible' : ''}`}
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>

        <button type="submit" className="cast-btn">
          Seek
        </button>
      </form>

      <div className="suggestions">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.query}
            type="button"
            className="pill"
            onClick={() => onSearch(suggestion.query, getFormCenter())}
          >
            <span className="pill-rune">✦</span> {suggestion.label}
          </button>
        ))}
      </div>
    </section>
  )
}
