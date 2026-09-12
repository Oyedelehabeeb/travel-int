import { Link } from '@tanstack/react-router'
import { Compass, Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link to="/" className="wordmark" aria-label="Travel Intelligence home">
          <span className="wordmark-mark"><Compass aria-hidden="true" /></span>
          <span><strong>Travel</strong><small>intelligence</small></span>
        </Link>
        <div className="nav-links">
          <Link to="/" activeOptions={{ exact: true }}>Discover</Link>
          <Link to="/explore/$passportSlug" params={{ passportSlug: 'nigeria' }}>Explore</Link>
          <Link to="/passports/$passportSlug" params={{ passportSlug: 'nigeria' }}>Passports</Link>
          <Link to="/destinations/$destinationSlug" params={{ destinationSlug: 'japan' }}>Destinations</Link>
          <Link to="/compare/$firstPassportSlug/$secondPassportSlug" params={{ firstPassportSlug: 'nigeria', secondPassportSlug: 'ghana' }}>Compare</Link>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <button type="button" className="menu-button" aria-label="Open navigation menu"><Menu aria-hidden="true" /></button>
        </div>
      </nav>
    </header>
  )
}
