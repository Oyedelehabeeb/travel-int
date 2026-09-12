import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

const DEFAULT_THEME: ThemeMode = 'dark'
const THEME_COLORS: Record<ThemeMode, string> = {
  light: '#f8fbfd',
  dark: '#182126',
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.dataset.theme = mode
  document.documentElement.style.colorScheme = mode
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[mode])
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_THEME)

  useEffect(() => {
    const stored = window.localStorage.getItem('theme')
    const initial =
      stored === 'dark' || stored === 'light'
        ? stored
        : DEFAULT_THEME
    setMode(initial)
    applyTheme(initial)
  }, [])

  return (
    <button
      type="button"
      className="theme-button"
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      onClick={() => {
        const next = mode === 'light' ? 'dark' : 'light'
        setMode(next)
        applyTheme(next)
        window.localStorage.setItem('theme', next)
      }}
    >
      {mode === 'light' ? (
        <Moon aria-hidden="true" />
      ) : (
        <Sun aria-hidden="true" />
      )}
    </button>
  )
}
