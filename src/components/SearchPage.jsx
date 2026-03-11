import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import recipes, { categories } from '../data/recipes'
import TableOfContents from './TableOfContents'

export default function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''

  const results = useMemo(() => {
    if (!query.trim()) return recipes
    const q = query.toLowerCase()
    return recipes.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.subtitle.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)) ||
      categories.find(c => c.id === r.category)?.label.toLowerCase().includes(q) ||
      r.ingredients.some(g => g.items.some(i => i.item.toLowerCase().includes(q)))
    )
  }, [query])

  return (
    <main className="search-page container">
      <div className="search-page-header">
        <h1 className="search-page-title">
          {query ? (
            <>Search results for <em>"{query}"</em></>
          ) : (
            'All Recipes'
          )}
        </h1>
        <p className="search-page-count">
          {results.length === 0
            ? 'No recipes found'
            : `${results.length} recipe${results.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="search-empty">
          <div className="search-empty-icon">🔍</div>
          <h2>No results for "{query}"</h2>
          <p>Try searching for an ingredient, cuisine, or recipe name.</p>
          <Link to="/contents" className="btn btn-primary">Browse All Recipes</Link>
        </div>
      ) : (
        <SearchResults recipes={results} />
      )}
    </main>
  )
}

function SearchResults({ recipes: results }) {
  return (
    <div className="recipe-grid">
      {results.map((recipe, idx) => {
        const cat = categories.find(c => c.id === recipe.category)
        return (
          <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="recipe-card">
            <div className="recipe-card-image-wrap">
              <img src={recipe.image} alt={recipe.imageAlt} className="recipe-card-image" loading="lazy" />
              <span className="recipe-card-number">#{idx + 1}</span>
              <span className="recipe-card-category">{cat?.icon} {cat?.label}</span>
            </div>
            <div className="recipe-card-body">
              <h3 className="recipe-card-title">{recipe.title}</h3>
              <p className="recipe-card-subtitle">{recipe.subtitle}</p>
              <div className="recipe-card-meta">
                <span className="meta-item">{recipe.totalTime}</span>
                <span className="meta-item">{recipe.servings} servings</span>
                <span className="meta-item">{recipe.difficulty}</span>
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
      })}
    </div>
  )
}
