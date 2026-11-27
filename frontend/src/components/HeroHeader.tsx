interface HeroHeaderProps {
  onReset: () => void
}

export function HeroHeader({ onReset }: HeroHeaderProps) {
  return (
    <div
      className="hero-header"
      role="button"
      tabIndex={0}
      onClick={onReset}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onReset()
        }
      }}
      title="Return to the Grimoire"
    >
      <svg className="emblem" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="32" cy="32" r="24" strokeDasharray="2 4" opacity="0.5" />
        <path
          d="M32 10 C37 22, 37 28, 32 32 C27 28, 27 22, 32 10 Z"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <path
          d="M32 54 C37 42, 37 36, 32 32 C27 36, 27 42, 32 54 Z"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <path
          d="M10 32 C22 27, 28 27, 32 32 C28 37, 22 37, 10 32 Z"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <path
          d="M54 32 C42 27, 36 27, 32 32 C36 37, 42 37, 54 32 Z"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <circle cx="32" cy="32" r="3" fill="#e4c686" stroke="none" />
      </svg>
      <h1 className="brand-title">GRIMOIRE</h1>
      <p className="brand-subtitle">A quiet spell to seek what time left behind…</p>
    </div>
  )
}
