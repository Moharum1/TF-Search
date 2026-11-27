import { useCallback, useEffect, useState } from 'react'
import type { Theme } from '../types/grimoire'

export function useTheme(initialTheme: Theme = 'twilight') {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'twilight' ? 'dawn' : 'twilight'))
  }, [])

  return { theme, toggleTheme }
}
