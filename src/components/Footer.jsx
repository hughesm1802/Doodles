import { Link } from 'react-router-dom'
import { categories } from '../data/recipes'
import { siteConfig } from '../data/siteConfig'

// Platform icon SVGs
function SocialIcon({ platform }) {
  if (platform === 'instagram') return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
  if (platform === 'tiktok') return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  )
  if (platform === 'youtube') return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
  return null
}

const PLATFORM_LABELS = { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube' }

export default function Footer() {
  const { brand, creator, social, tagline } = siteConfig
  const socialLinks = Object.entries(social).filter(([, url]) => !!url)

  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Link to="/" className="site-logo footer-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">
              <span className="logo-primary">{brand}</span>
              <span className="logo-secondary">{creator.handle}</span>
            </span>
          </Link>
          <p className="footer-tagline">{tagline}</p>

          {socialLinks.length > 0 && (
            <div className="footer-social">
              {socialLinks.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={`Follow on ${PLATFORM_LABELS[platform] ?? platform}`}
                >
                  <SocialIcon platform={platform} />
                  <span>{PLATFORM_LABELS[platform] ?? platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            {categories.map(cat => (
              <li key={cat.id}>
                <Link to={`/category/${cat.id}`}>
                  {cat.icon} {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Navigate</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contents">All Recipes</Link></li>
            <li><Link to="/search">Search</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">About</h4>
          <p className="footer-about-text">
            All recipes are {creator.name}&apos;s personal content, also shared on{' '}
            {socialLinks.map(([p], i) => (
              <span key={p}>
                {i > 0 && i < socialLinks.length - 1 ? ', ' : i > 0 ? ' and ' : ''}
                {PLATFORM_LABELS[p] ?? p}
              </span>
            ))}.
            Nutritional values are approximate and calculated per serving.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} {brand} by {creator.name}. All recipe content is original and personal.
          </p>
          <p className="footer-note">
            Nutritional information is approximate. Always consult a healthcare professional for dietary advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
