import type { PageView, Theme } from '../types/grimoire'

interface TopBarProps {
  theme: Theme
  activePage: PageView
  onToggleTheme: () => void
  onNavigate: (page: PageView) => void
}

export function TopBar({ theme, activePage, onToggleTheme, onNavigate }: TopBarProps) {
  const isTwilight = theme === 'twilight'

  return (
    <header className="top-bar">
      <div className="chronicle-note">
        <span className="chronicle-dot" />
        <span>29 years after the passing of the Hero Himmel</span>
      </div>

      <div className="controls">
        <nav className="nav-tabs" aria-label="Primary navigation">
          <button
            type="button"
            className={`ghost-btn${activePage === 'search' ? ' active-nav' : ''}`}
            onClick={() => onNavigate('search')}
          >
            <span>✦</span>
            <span>Search</span>
          </button>
          <button
            type="button"
            className={`ghost-btn${activePage === 'upload' ? ' active-nav' : ''}`}
            onClick={() => onNavigate('upload')}
          >
            <span>＋</span>
            <span>Upload .txt</span>
          </button>
        </nav>

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
