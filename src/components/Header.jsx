import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { siteConfig } from '../data/siteConfig'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="site-logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">
            <span className="logo-primary">{siteConfig.brand}</span>
            <span className="logo-secondary">{siteConfig.creator.handle}</span>
          </span>
        </Link>

        <button
          className={`header-search-toggle ${searchOpen ? 'header-search-toggle--open' : ''}`}
          onClick={() => setSearchOpen(o => !o)}
          aria-label="Search"
          aria-expanded={searchOpen}
        >
          {searchOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {searchOpen && (
        <div className="header-search-drawer">
          <form onSubmit={handleSearch} className="header-search-form">
            <input
              type="search"
              placeholder="Search recipes…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="header-search-input"
              aria-label="Search recipes"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <button type="submit" className="header-search-submit" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
