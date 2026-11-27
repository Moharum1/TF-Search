interface MagicCircleProps {
  castCount: number
}

export function MagicCircle({ castCount }: MagicCircleProps) {
  const isCasting = castCount > 0

  return (
    <>
      <div
        key={`pulse-${castCount}`}
        className={`spell-pulse${isCasting ? ' active' : ''}`}
      />

      <div
        key={`circle-${castCount}`}
        className={`magic-circle-wrapper${isCasting ? ' casting' : ''}`}
      >
        <svg viewBox="0 0 400 400" fill="none" stroke="currentColor">
          <g className="ring-outer">
            <circle cx="200" cy="200" r="188" strokeWidth="0.9" opacity="0.8" />
            <circle cx="200" cy="200" r="180" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.7" />
            <circle cx="200" cy="200" r="158" strokeWidth="0.8" opacity="0.65" />
            <g strokeWidth="1" opacity="0.85">
              <line x1="200" y1="12" x2="200" y2="28" />
              <line x1="200" y1="372" x2="200" y2="388" />
              <line x1="12" y1="200" x2="28" y2="200" />
              <line x1="372" y1="200" x2="388" y2="200" />
              <line x1="67" y1="67" x2="79" y2="79" />
              <line x1="321" y1="321" x2="333" y2="333" />
              <line x1="333" y1="67" x2="321" y2="79" />
              <line x1="79" y1="321" x2="67" y2="333" />
            </g>
            <circle cx="200" cy="12" r="3.5" fill="currentColor" />
            <circle cx="200" cy="388" r="3.5" fill="currentColor" />
            <circle cx="12" cy="200" r="3.5" fill="currentColor" />
            <circle cx="388" cy="200" r="3.5" fill="currentColor" />
          </g>

          <g className="ring-inner">
            <circle cx="200" cy="200" r="134" strokeWidth="0.8" strokeDasharray="10 5" opacity="0.75" />
            <rect x="105" y="105" width="190" height="190" strokeWidth="0.7" opacity="0.65" />
            <rect
              x="105"
              y="105"
              width="190"
              height="190"
              strokeWidth="0.7"
              opacity="0.65"
              transform="rotate(45 200 200)"
            />
            <polygon
              points="200,82 232,168 318,200 232,232 200,318 168,232 82,200 168,168"
              strokeWidth="0.75"
              opacity="0.55"
            />
            <circle cx="200" cy="200" r="68" strokeWidth="0.8" opacity="0.5" />
          </g>
        </svg>
      </div>
    </>
  )
}
