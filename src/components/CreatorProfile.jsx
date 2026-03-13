import { siteConfig } from '../data/siteConfig'

// SVG icons for each platform
function IconInstagram() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function IconTikTok() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

const SOCIAL_ICONS = {
  instagram: { Icon: IconInstagram, label: 'Instagram', color: '#e1306c' },
  tiktok:    { Icon: IconTikTok,    label: 'TikTok',    color: '#010101' },
  youtube:   { Icon: IconYouTube,   label: 'YouTube',   color: '#ff0000' },
}

export default function CreatorProfile({ variant = 'section' }) {
  const { creator, social } = siteConfig
  const socialLinks = Object.entries(social).filter(([, url]) => !!url)

  if (variant === 'card') {
    return (
      <div className="creator-card">
        {creator.avatar && (
          <img src={creator.avatar} alt={creator.name} className="creator-card-avatar" />
        )}
        <div className="creator-card-body">
          <p className="creator-card-name">{creator.name}</p>
          <p className="creator-card-handle">{creator.handle}</p>
        </div>
        <div className="creator-card-social">
          {socialLinks.map(([platform, url]) => {
            const { Icon, label, color } = SOCIAL_ICONS[platform] ?? {}
            if (!Icon) return null
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="creator-social-icon"
                aria-label={label}
                style={{ '--icon-color': color }}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  // Full section variant (used on homepage)
  return (
    <section className="creator-section">
      <div className="container">
        <div className="creator-inner">
          <div className="creator-avatar-wrap">
            {creator.avatar ? (
              <img src={creator.avatar} alt={creator.name} className="creator-avatar" />
            ) : (
              <div className="creator-avatar-placeholder" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <div className="creator-content">
            <p className="creator-eyebrow">Created by</p>
            <h2 className="creator-name">{creator.name}</h2>
            <p className="creator-handle">{creator.handle}</p>
            <p className="creator-bio">{creator.bio}</p>

            {socialLinks.length > 0 && (
              <div className="creator-social-links">
                <p className="creator-social-label">Follow along</p>
                <div className="creator-social-row">
                  {socialLinks.map(([platform, url]) => {
                    const { Icon, label, color } = SOCIAL_ICONS[platform] ?? {}
                    if (!Icon) return null
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="creator-social-btn"
                        aria-label={`Follow on ${label}`}
                        style={{ '--icon-color': color }}
                      >
                        <Icon />
                        <span>{label}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
