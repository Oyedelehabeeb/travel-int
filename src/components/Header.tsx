import { Link } from '@tanstack/react-router'
import { Compass, Menu, X } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

const navigation = [
  ['Discover', '/'],
  ['Explore', '/explore'],
  ['Passports', '/passports'],
  ['Destinations', '/destinations'],
  ['Compare', '/compare'],
] as const

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link to="/" className="wordmark" aria-label="Travel Intelligence home">
          <span className="wordmark-mark">
            <Compass aria-hidden="true" />
          </span>
          <span>
            <strong>Travel</strong>
            <small>intelligence</small>
          </span>
        </Link>
        <div
          id="primary-links"
          className={`nav-links${menuOpen ? ' is-open' : ''}`}
        >
          {navigation.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === '/' }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <button
            type="button"
            className="menu-button"
            aria-label={
              menuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            aria-controls="primary-links"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  )
}
