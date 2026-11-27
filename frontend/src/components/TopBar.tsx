import type { Theme } from '../types/grimoire'

interface TopBarProps {
  theme: Theme
  onToggleTheme: () => void
}

export function TopBar({ theme, onToggleTheme }: TopBarProps) {
  const isTwilight = theme === 'twilight'

  return (
    <header className="top-bar">
      <div className="chronicle-note">
        <span className="chronicle-dot" />
        <span>29 years after the passing of the Hero Himmel</span>
      </div>

      <div className="controls">
        <button
          type="button"
          className="ghost-btn"
          onClick={onToggleTheme}
          title="Switch between Twilight and Dawn Meadow"
        >
          <span>{isTwilight ? '☾' : '☀'}</span>
          <span>{isTwilight ? 'Twilight' : 'Dawn Meadow'}</span>
        </button>
      </div>
    </header>
  )
}
