import { Link } from 'react-router-dom'
import recipes, { categories } from '../data/recipes'

const FEATURED_IDS = [
  'spaghetti-carbonara',
  'chicken-tikka-masala',
  'birria-beef-tacos',
  'chocolate-lava-cake',
]

export default function HomePage() {
  const featured = recipes.filter(r => FEATURED_IDS.includes(r.id)).slice(0, 4)
  const allFeatured = recipes.slice(0, 4)

  return (
    <main className="homepage">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
            alt="Beautifully presented dishes on a dining table"
            className="hero-image"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content container">
          <div className="hero-badge">The Complete Culinary Collection</div>
          <h1 className="hero-title">
            Recipes Worth<br />
            <em>Mastering</em>
          </h1>
          <p className="hero-subtitle">
            Step-by-step video guides, precise ingredient lists, and full nutritional breakdowns
            for dishes from eight world cuisines — all in one beautifully crafted ebook.
          </p>
          <div className="hero-actions">
            <Link to="/contents" className="btn btn-primary btn-lg">
              Browse All Recipes
            </Link>
            <Link to="/recipe/spaghetti-carbonara" className="btn btn-outline-light btn-lg">
              Start Cooking
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{recipes.length}</strong>
              <span>Recipes</span>
            </div>
            <div className="hero-stat">
              <strong>{categories.length}</strong>
              <span>Cuisines</span>
            </div>
            <div className="hero-stat">
              <strong>{recipes.length}</strong>
              <span>Video Guides</span>
            </div>
            <div className="hero-stat">
              <strong>100%</strong>
              <span>Nutrition Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="features-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Everything You Need to Cook With Confidence</h2>
            <p className="section-subtitle">
              Each recipe is a complete culinary guide — not just a list of instructions.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Video Walkthroughs</h3>
              <p>Embedded HD video guides for every recipe so you can watch as you cook, pause and replay critical steps.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Detailed Ingredient Lists</h3>
              <p>Precise measurements, ingredient notes, and grouped sections so prep is organised and nothing is missed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👣</div>
              <h3>Step-by-Step Instructions</h3>
              <p>Numbered steps with technique tips, common mistakes to avoid, and optional variations for every skill level.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Nutritional Information</h3>
              <p>Full macro breakdowns, vitamins, minerals, allergen alerts, and daily value percentages per serving.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Searchable & Filterable</h3>
              <p>Find recipes by cuisine, difficulty, cooking time, or ingredient using the built-in search and category filters.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile-Ready</h3>
              <p>Fully responsive design so you can follow along on any device — from desktop to phone, on the worktop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Recipes</h2>
              <p className="section-subtitle">Our most popular dishes, handpicked for you.</p>
            </div>
            <Link to="/contents" className="btn btn-secondary">View All</Link>
          </div>

          <div className="featured-grid">
            {allFeatured.map((recipe, idx) => (
              <FeaturedCard key={recipe.id} recipe={recipe} large={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Explore by Cuisine</h2>
            <p className="section-subtitle">From the streets of Mexico City to the bistros of Paris.</p>
          </div>
          <div className="categories-grid">
            {categories.map(cat => {
              const count = recipes.filter(r => r.category === cat.id).length
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="category-tile"
                >
                  <span className="category-tile-icon">{cat.icon}</span>
                  <span className="category-tile-label">{cat.label}</span>
                  <span className="category-tile-count">{count} {count === 1 ? 'recipe' : 'recipes'}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Table of Contents preview */}
      <section className="toc-preview-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Complete Recipe Index</h2>
            <p className="section-subtitle">A structured guide to every recipe in this ebook.</p>
          </div>
          <div className="toc-preview-table">
            <div className="toc-preview-header">
              <span>#</span>
              <span>Recipe</span>
              <span>Cuisine</span>
              <span>Time</span>
              <span>Difficulty</span>
              <span></span>
            </div>
            {recipes.map((r, i) => {
              const cat = categories.find(c => c.id === r.category)
              return (
                <div key={r.id} className="toc-preview-row">
                  <span className="toc-row-num">{i + 1}</span>
                  <span className="toc-row-title">
                    <img src={r.image} alt="" className="toc-row-thumb" loading="lazy" />
                    <span>
                      <strong>{r.title}</strong>
                      <em>{r.subtitle}</em>
                    </span>
                  </span>
                  <span className="toc-row-cat">{cat?.icon} {cat?.label}</span>
                  <span className="toc-row-time">{r.totalTime}</span>
                  <span className={`toc-row-diff diff-${r.difficulty.toLowerCase()}`}>{r.difficulty}</span>
                  <span>
                    <Link to={`/recipe/${r.id}`} className="btn btn-sm btn-outline">View</Link>
                  </span>
                </div>
              )
            })}
          </div>
          <div className="toc-preview-footer">
            <Link to="/contents" className="btn btn-primary">Open Full Directory</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function FeaturedCard({ recipe, large }) {
  const cat = categories.find(c => c.id === recipe.category)
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className={`featured-card ${large ? 'featured-card-large' : ''}`}
    >
      <div className="featured-card-image-wrap">
        <img
          src={recipe.image}
          alt={recipe.imageAlt}
          className="featured-card-image"
          loading={large ? 'eager' : 'lazy'}
        />
        <div className="featured-card-overlay" />
      </div>
      <div className="featured-card-body">
        <span className="featured-card-category">{cat?.icon} {cat?.label}</span>
        <h3 className="featured-card-title">{recipe.title}</h3>
        {large && <p className="featured-card-desc">{recipe.description.slice(0, 140)}…</p>}
        <div className="featured-card-meta">
          <span>{recipe.totalTime}</span>
          <span>{recipe.difficulty}</span>
          <span>{recipe.nutrition.calories} kcal</span>
        </div>
      </div>
    </Link>
  )
}
