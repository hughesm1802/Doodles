import { useState } from 'react'

export default function VideoEmbed({ videoId, title }) {
  const [loaded, setLoaded] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (!videoId) return null

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <section className="video-section" id="video-guide">
      <div className="video-section-header">
        <div className="video-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
          </svg>
        </div>
        <div>
          <h2 className="video-section-title">Video Guide</h2>
          <p className="video-section-desc">Watch the full recipe walkthrough before you begin</p>
        </div>
      </div>

      <div className={`video-container ${expanded ? 'video-expanded' : ''}`}>
        {!loaded ? (
          <div
            className="video-thumbnail"
            onClick={() => setLoaded(true)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setLoaded(true)}
            aria-label={`Play video: ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={`Video thumbnail for ${title}`}
              className="video-thumb-img"
              onError={e => { e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
            />
            <div className="video-thumb-overlay">
              <div className="play-button" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="video-thumb-title">{title}</p>
              <p className="video-thumb-cta">Click to play</p>
            </div>
          </div>
        ) : (
          <div className="video-iframe-wrap">
            <iframe
              src={`${embedUrl}&autoplay=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="video-iframe"
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div className="video-controls-row">
        <button
          className="btn btn-sm btn-outline"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
        >
          {expanded ? 'Collapse video' : 'Expand video'}
        </button>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-ghost"
        >
          Watch on YouTube
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </section>
  )
}
