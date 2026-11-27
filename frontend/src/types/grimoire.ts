export type Theme = 'twilight' | 'dawn'

export interface GrimoireEntry {
  id: string
  title: string
  category: string
  era: string
  excerpt: string
  tags?: string[]
  score?: number
}

export interface SearchSuggestion {
  label: string
  query: string
}

export type ParticleKind = 'petal' | 'mote'
export type ParticleColor = 'cyan' | 'gold'

export interface ManaCanvasHandle {
  spawnBurst: (cx: number, cy: number, count?: number, type?: ParticleKind) => void
  spawnSpark: (x: number, y: number) => void
  castFlowerField: () => void
}
