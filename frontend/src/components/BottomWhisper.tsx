interface BottomWhisperProps {
  onCastFlowerField: () => void
}

export function BottomWhisper({ onCastFlowerField }: BottomWhisperProps) {
  return (
    <footer className="bottom-whisper">
      <span className="quote-whisper">"It’s a mere ten-year journey."</span>
      <button type="button" className="flower-spell-btn" onClick={onCastFlowerField}>
        <span>✿</span> Cast: Field of Flowers
      </button>
    </footer>
  )
}
