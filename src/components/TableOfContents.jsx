import { useState } from 'react'
import { Link } from 'react-router-dom'
import recipes, { categories } from '../data/recipes'

const DIFFICULTY_COLORS = {
  Easy:     '#22c55e',
  Medium:   '#f59e0b',
  Advanced: '#ef4444',
}

export default function TableOfContents({ filterCategory }) {
  const [activeCategory, setActiveCategory] = useState(filterCategory || 'all')
  const [sortBy, setSortBy] = useState('default')
  const [view, setView] = useState('grid')

  const filtered = recipes.filter(r =>
    activeCategory === 'all' ? true : r.category === activeCategory
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'difficulty') {
      const order = { Easy: 0, Medium: 1, Advanced: 2 }
      return order[a.difficulty] - order[b.difficulty]
    }
    if (sortBy === 'time') {
      const toMin = s => {
        const m = s.match(/(\d+)\s*hr/)
        const h = m ? parseInt(m[1], 10) * 60 : 0
        const mn = s.match(/(\d+)\s*min/)
        return h + (mn ? parseInt(mn[1], 10) : 0)
      }
      return toMin(a.totalTime) - toMin(b.totalTime)
    }
    return 0
  })

  return (
    <div className="toc-wrapper">
      {/* Category filter pills */}
      {!filterCategory && (
        <div className="toc-filters">
          <button
            className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Recipes
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="toc-toolbar">
        <p className="toc-count">
          {sorted.length} {sorted.length === 1 ? 'recipe' : 'recipes'}
          {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
        </p>

        <div className="toc-controls">
          <label className="toc-label" htmlFor="sort-select">Sort:</label>
          <select
            id="sort-select"
            className="toc-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="title">A–Z</option>
            <option value="difficulty">Difficulty</option>
            <option value="time">Total Time</option>
          </select>

          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </button>
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              aria-label="List view"
              title="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <rect x="1" y="2" width="14" height="2" rx="1" />
                <rect x="1" y="7" width="14" height="2" rx="1" />
                <rect x="1" y="12" width="14" height="2" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Recipe grid / list */}
      {sorted.length === 0 ? (
        <div className="toc-empty">
          <p>No recipes found in this category yet. Check back soon!</p>
        </div>
      ) : view === 'grid' ? (
        <div className="recipe-grid">
          {sorted.map((recipe, idx) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={idx + 1} />
          ))}
        </div>
      ) : (
        <ol className="recipe-list-view">
          {sorted.map((recipe, idx) => (
            <RecipeListItem key={recipe.id} recipe={recipe} index={idx + 1} />
          ))}
        </ol>
      )}
    </div>
  )
}

function RecipeCard({ recipe, index }) {
  const cat = categories.find(c => c.id === recipe.category)

  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card" aria-label={`Go to ${recipe.title}`}>
      <div className="recipe-card-image-wrap">
        <img
          src={recipe.image}
          alt={recipe.imageAlt}
          className="recipe-card-image"
          loading="lazy"
        />
        <span className="recipe-card-number">#{index}</span>
        <span className="recipe-card-category">{cat?.icon} {cat?.label}</span>
      </div>

      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-subtitle">{recipe.subtitle}</p>

        <div className="recipe-card-meta">
          <span className="meta-item" title="Total time">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            {recipe.totalTime}
          </span>
          <span className="meta-item" title="Servings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
              <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
            </svg>
            Serves {recipe.servings}
          </span>
          <span
            className="meta-item difficulty-badge"
            style={{ color: DIFFICULTY_COLORS[recipe.difficulty] }}
            title="Difficulty"
          >
            {recipe.difficulty}
          </span>
        </div>

        <div className="recipe-card-tags">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="recipe-card-footer">
          <span className="recipe-card-calories">{recipe.nutrition.calories} kcal</span>
          <span className="recipe-card-cta">
            View Recipe
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

function RecipeListItem({ recipe, index }) {
  const cat = categories.find(c => c.id === recipe.category)

  return (
    <li className="recipe-list-item">
      <span className="list-number">{index}</span>
      <img
        src={recipe.image}
        alt={recipe.imageAlt}
        className="list-thumb"
        loading="lazy"
      />
      <div className="list-info">
        <Link to={`/recipe/${recipe.id}`} className="list-title">{recipe.title}</Link>
        <p className="list-subtitle">{recipe.subtitle}</p>
        <div className="recipe-card-meta">
          <span className="meta-item">{cat?.icon} {cat?.label}</span>
          <span className="meta-item">{recipe.totalTime}</span>
          <span className="meta-item" style={{ color: DIFFICULTY_COLORS[recipe.difficulty] }}>
            {recipe.difficulty}
          </span>
          <span className="meta-item">{recipe.nutrition.calories} kcal</span>
        </div>
      </div>
      <Link to={`/recipe/${recipe.id}`} className="list-cta-btn">View</Link>
    </li>
  )
}
