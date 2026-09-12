import { Link } from '@tanstack/react-router'
import { Compass } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Compass aria-hidden="true" />
          <div><strong>Travel Intelligence</strong><span>Explore the world through your passport.</span></div>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/explore/$passportSlug" params={{ passportSlug: 'nigeria' }}>Explore access</Link>
          <Link to="/about">Methodology</Link>
          <a href="mailto:hello@example.com">Contact</a>
        </nav>
        <p>Visa policies change. Verify important requirements with the relevant authority before travel.</p>
      </div>
    </footer>
  )
}
