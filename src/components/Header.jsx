import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link to="/" className="site-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">
            <span className="logo-primary">The Culinary</span>
            <span className="logo-secondary">Ebook</span>
          </span>
        </Link>

        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/contents" className="nav-link" onClick={() => setMenuOpen(false)}>All Recipes</Link>
          <Link to="/category/italian" className="nav-link" onClick={() => setMenuOpen(false)}>Italian</Link>
          <Link to="/category/mexican" className="nav-link" onClick={() => setMenuOpen(false)}>Mexican</Link>
          <Link to="/category/desserts" className="nav-link" onClick={() => setMenuOpen(false)}>Desserts</Link>

          <form onSubmit={handleSearch} className="header-search-form mobile-only">
            <input
              type="search"
              placeholder="Search recipes…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="header-search-input"
              aria-label="Search recipes"
            />
            <button type="submit" className="header-search-btn" aria-label="Submit search">Search</button>
          </form>
        </nav>

        <form onSubmit={handleSearch} className="header-search-form desktop-only">
          <input
            type="search"
            placeholder="Search recipes…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="header-search-input"
            aria-label="Search recipes"
          />
          <button type="submit" className="header-search-btn" aria-label="Submit search">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </button>
        </form>

        <button
          className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  )
}
