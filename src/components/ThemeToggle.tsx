import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.dataset.theme = mode
  document.documentElement.style.colorScheme = mode
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem('theme')
    const initial = stored === 'dark' || stored === 'light'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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
      {mode === 'light' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </button>
  )
}
