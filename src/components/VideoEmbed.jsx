import { useState, useEffect, useRef } from 'react'

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Detect platform and extract id/url from a raw URL string. */
export function parseVideoUrl(url) {
  if (!url) return null
  // YouTube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  )
  if (yt) return { type: 'youtube', id: yt[1], url }
  // Instagram Reel / post
  if (/instagram\.com\/(reel|p)\//.test(url)) return { type: 'instagram', url }
  // TikTok
  if (/tiktok\.com/.test(url)) {
    const tt = url.match(/\/video\/(\d+)/)
    return { type: 'tiktok', id: tt?.[1] ?? null, url }
  }
  return null
}

/** Normalise the various prop shapes callers may pass. */
function normaliseVideo(video, videoId, videoTitle) {
  if (video) {
    if (video.type) return { title: videoTitle, ...video }
    if (typeof video === 'string') return { title: videoTitle, ...parseVideoUrl(video) }
  }
  if (videoId) return { type: 'youtube', id: videoId, title: videoTitle }
  return null
}

// ─── platform renderers ──────────────────────────────────────────────────────

function YouTubeEmbed({ id, title, expanded }) {
  const [loaded, setLoaded] = useState(false)
  const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''
  const embedBase = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&origin=${origin}`
  const thumbHi   = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  const thumbFb   = `https://img.youtube.com/vi/${id}/hqdefault.jpg`

  return (
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
            src={thumbHi}
            alt={`Thumbnail for ${title}`}
            className="video-thumb-img"
            onError={e => { e.target.src = thumbFb }}
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
            src={`${embedBase}&autoplay=1`}
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
  )
}

function InstagramEmbed({ url }) {
  const containerRef = useRef(null)

  useEffect(() => {
    function process() {
      if (window.instgrm?.Embeds) window.instgrm.Embeds.process()
    }
    const existing = document.getElementById('instagram-embed-script')
    if (existing) {
      process()
    } else {
      const script = document.createElement('script')
      script.id    = 'instagram-embed-script'
      script.src   = 'https://www.instagram.com/embed.js'
      script.async = true
      script.onload = process
      document.body.appendChild(script)
    }
  }, [url])

  const cleanUrl = url.split('?')[0].replace(/\/?$/, '/')

  return (
    <div className="video-container video-container-social" ref={containerRef}>
      <div className="social-embed-wrap">
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={`${cleanUrl}?utm_source=ig_embed&utm_campaign=loading`}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: 0,
            borderRadius: '3px',
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: '1px',
            maxWidth: '540px',
            minWidth: '326px',
            padding: 0,
            width: '99.375%',
          }}
        >
          <div style={{ padding: '16px' }}>
            <a href={cleanUrl} target="_blank" rel="noopener noreferrer"
              style={{ color: '#c7a17a', fontFamily: 'sans-serif', fontSize: '14px', textDecoration: 'none' }}>
              View this post on Instagram
            </a>
          </div>
        </blockquote>
      </div>
    </div>
  )
}

function TikTokEmbed({ id, url }) {
  useEffect(() => {
    if (!document.getElementById('tiktok-embed-script')) {
      const script = document.createElement('script')
      script.id    = 'tiktok-embed-script'
      script.src   = 'https://www.tiktok.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [url])

  return (
    <div className="video-container video-container-social">
      <div className="social-embed-wrap">
        <blockquote
          className="tiktok-embed"
          cite={url}
          data-video-id={id}
          data-embed-from="embed_page"
          style={{ maxWidth: '605px', minWidth: '325px' }}
        >
          <section>
            <a href={url} target="_blank" rel="noopener noreferrer"
              style={{ color: '#c7a17a', fontFamily: 'sans-serif', fontSize: '14px' }}>
              Watch on TikTok
            </a>
          </section>
        </blockquote>
      </div>
    </div>
  )
}

// ─── Platform badge ───────────────────────────────────────────────────────────

const PLATFORM_META = {
  youtube:   { label: 'YouTube',        watchLabel: 'Watch on YouTube',  color: '#ff0000' },
  instagram: { label: 'Instagram Reel', watchLabel: 'View on Instagram', color: '#e1306c' },
  tiktok:    { label: 'TikTok',         watchLabel: 'Watch on TikTok',   color: '#010101' },
}

function PlatformBadge({ type }) {
  const meta = PLATFORM_META[type]
  if (!meta) return null
  return (
    <span className="video-platform-badge" style={{ '--badge-color': meta.color }}>
      {meta.label}
    </span>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * Supports multiple calling conventions:
 *   <VideoEmbed videoId="abc" videoTitle="..." />                              ← legacy YouTube
 *   <VideoEmbed video={{ type: 'youtube',   id: 'abc',          title: '...' }} />
 *   <VideoEmbed video={{ type: 'instagram', url: 'https://...', title: '...' }} />
 *   <VideoEmbed video={{ type: 'tiktok',    url: 'https://...', title: '...' }} />
 */
export default function VideoEmbed({ video, videoId, videoTitle }) {
  const [expanded, setExpanded] = useState(false)
  const v = normaliseVideo(video, videoId, videoTitle)

  if (!v?.type) return null

  const title   = v.title || 'Recipe Video'
  const meta    = PLATFORM_META[v.type] ?? {}
  const watchUrl =
    v.type === 'youtube'
      ? `https://www.youtube.com/watch?v=${v.id}`
      : v.url

  return (
    <section className="video-section" id="video-guide">
      <div className="video-section-header">
        <div className="video-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
          </svg>
        </div>
        <div>
          <h2 className="video-section-title">
            Video Guide
            <PlatformBadge type={v.type} />
          </h2>
          <p className="video-section-desc">Watch the full recipe walkthrough before you begin</p>
        </div>
      </div>

      {v.type === 'youtube'   && <YouTubeEmbed   id={v.id} title={title} expanded={expanded} />}
      {v.type === 'instagram' && <InstagramEmbed url={v.url} title={title} />}
      {v.type === 'tiktok'    && <TikTokEmbed    id={v.id} url={v.url} title={title} />}

      <div className="video-controls-row">
        {v.type === 'youtube' && (
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
          >
            {expanded ? 'Collapse video' : 'Expand video'}
          </button>
        )}
        {watchUrl && (
          <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
            {meta.watchLabel ?? 'Watch video'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>
    </section>
  )
}
