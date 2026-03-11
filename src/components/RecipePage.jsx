import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import recipes, { categories } from '../data/recipes'
import VideoEmbed from './VideoEmbed'
import IngredientList from './IngredientList'
import StepByStep from './StepByStep'
import NutritionInfo from './NutritionInfo'

const DIFFICULTY_COLORS = {
  Easy:     '#22c55e',
  Medium:   '#f59e0b',
  Advanced: '#ef4444',
}

export default function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = recipes.find(r => r.id === id)
  const [servings, setServings] = useState(recipe?.servings || 4)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings)
      document.title = `${recipe.title} | The Culinary Ebook`
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return () => { document.title = 'The Culinary Ebook' }
  }, [id, recipe])

  useEffect(() => {
    const sections = ['video-guide', 'ingredients', 'instructions', 'nutrition']
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [recipe])

  if (!recipe) {
    return (
      <main className="not-found container">
        <h1>Recipe Not Found</h1>
        <p>The recipe you are looking for does not exist or may have been moved.</p>
        <Link to="/contents" className="btn btn-primary">Browse All Recipes</Link>
      </main>
    )
  }

  const cat = categories.find(c => c.id === recipe.category)
  const recipeIndex = recipes.findIndex(r => r.id === id)
  const prevRecipe = recipeIndex > 0 ? recipes[recipeIndex - 1] : null
  const nextRecipe = recipeIndex < recipes.length - 1 ? recipes[recipeIndex + 1] : null

  const navItems = [
    { id: 'video-guide',   label: 'Video',        show: !!recipe.videoId },
    { id: 'ingredients',   label: 'Ingredients',  show: true },
    { id: 'instructions',  label: 'Instructions', show: true },
    { id: 'nutrition',     label: 'Nutrition',    show: true },
  ].filter(n => n.show)

  function scrollTo(sectionId) {
    const el = document.getElementById(sectionId)
    if (el) {
      const offset = 80 // header height
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    <main className="recipe-page">
      {/* Hero */}
      <div className="recipe-hero">
        <div className="recipe-hero-image-wrap">
          <img
            src={recipe.image}
            alt={recipe.imageAlt}
            className="recipe-hero-image"
          />
          <div className="recipe-hero-overlay" />
        </div>
        <div className="recipe-hero-content container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/contents">Recipes</Link>
            <span aria-hidden="true">›</span>
            <Link to={`/category/${recipe.category}`}>{cat?.icon} {cat?.label}</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{recipe.title}</span>
          </nav>

          <div className="recipe-hero-badge">{cat?.icon} {cat?.label}</div>
          <h1 className="recipe-hero-title">{recipe.title}</h1>
          <p className="recipe-hero-subtitle">{recipe.subtitle}</p>

          <div className="recipe-hero-meta">
            <div className="meta-pill">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              <span className="meta-pill-label">Prep</span>
              <strong>{recipe.prepTime}</strong>
            </div>
            <div className="meta-pill">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path d="M3.5 2A1.5 1.5 0 002 3.5V5c0 1.149.15 2.263.43 3.326a13.022 13.022 0 009.244 9.244c1.063.28 2.177.43 3.326.43h1.5a1.5 1.5 0 001.5-1.5v-.5a1.5 1.5 0 00-1.5-1.5H16a11.5 11.5 0 01-11-11v-.5A1.5 1.5 0 003.5 2z" />
              </svg>
              <span className="meta-pill-label">Cook</span>
              <strong>{recipe.cookTime}</strong>
            </div>
            <div className="meta-pill">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
              </svg>
              <span className="meta-pill-label">Serves</span>
              <strong>{servings}</strong>
            </div>
            <div className="meta-pill" style={{ color: DIFFICULTY_COLORS[recipe.difficulty] }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.48a31.525 31.525 0 00-1.66-1.02 41.052 41.052 0 018.198-5.424z" clipRule="evenodd" />
              </svg>
              <span className="meta-pill-label">Level</span>
              <strong>{recipe.difficulty}</strong>
            </div>
            <div className="meta-pill">
              <span className="meta-pill-label">Calories</span>
              <strong>{recipe.nutrition.calories} kcal</strong>
            </div>
          </div>

          {recipe.chef && (
            <div className="recipe-chef">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
              </svg>
              Recipe by <strong>{recipe.chef}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Sticky nav */}
      <nav className="recipe-sticky-nav" aria-label="Recipe sections">
        <div className="container recipe-sticky-nav-inner">
          <div className="sticky-nav-links">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`sticky-nav-btn ${activeSection === item.id ? 'sticky-nav-active' : ''}`}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="sticky-nav-tags">
            {recipe.tags.slice(0, 3).map(t => (
              <span key={t} className="tag tag-sm">{t}</span>
            ))}
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="recipe-body container">
        <div className="recipe-layout">
          {/* Main column */}
          <div className="recipe-main-col">
            {/* Description */}
            <section className="recipe-description-section" id="overview">
              <p className="recipe-description">{recipe.description}</p>
            </section>

            {/* Video */}
            {recipe.videoId && (
              <VideoEmbed videoId={recipe.videoId} title={recipe.videoTitle || recipe.title} />
            )}

            {/* Ingredients */}
            <IngredientList
              ingredients={recipe.ingredients}
              defaultServings={recipe.servings}
              currentServings={servings}
              onServingsChange={setServings}
            />

            {/* Steps */}
            <StepByStep steps={recipe.steps} />

            {/* Nutrition */}
            <NutritionInfo
              nutrition={recipe.nutrition}
              currentServings={servings}
              defaultServings={recipe.servings}
            />
          </div>

          {/* Sidebar */}
          <aside className="recipe-sidebar">
            <div className="sidebar-sticky">
              {/* Quick summary card */}
              <div className="sidebar-card">
                <h3 className="sidebar-card-title">At a Glance</h3>
                <div className="sidebar-stats">
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Prep Time</span>
                    <span className="sidebar-stat-value">{recipe.prepTime}</span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Cook Time</span>
                    <span className="sidebar-stat-value">{recipe.cookTime}</span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Total Time</span>
                    <span className="sidebar-stat-value">{recipe.totalTime}</span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Servings</span>
                    <span className="sidebar-stat-value">{servings}</span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Difficulty</span>
                    <span className="sidebar-stat-value" style={{ color: DIFFICULTY_COLORS[recipe.difficulty] }}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Calories</span>
                    <span className="sidebar-stat-value">{recipe.nutrition.calories} kcal</span>
                  </div>
                </div>
              </div>

              {/* Section nav */}
              <div className="sidebar-card">
                <h3 className="sidebar-card-title">Jump to Section</h3>
                <nav className="sidebar-nav">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      className={`sidebar-nav-btn ${activeSection === item.id ? 'sidebar-nav-active' : ''}`}
                      onClick={() => scrollTo(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tags */}
              <div className="sidebar-card">
                <h3 className="sidebar-card-title">Tags</h3>
                <div className="sidebar-tags">
                  {recipe.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Prev / Next navigation */}
        <nav className="recipe-pagination" aria-label="Recipe navigation">
          {prevRecipe ? (
            <Link to={`/recipe/${prevRecipe.id}`} className="recipe-pagination-prev">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="pagination-direction">Previous Recipe</span>
                <span className="pagination-title">{prevRecipe.title}</span>
              </div>
            </Link>
          ) : <div />}

          {nextRecipe ? (
            <Link to={`/recipe/${nextRecipe.id}`} className="recipe-pagination-next">
              <div>
                <span className="pagination-direction">Next Recipe</span>
                <span className="pagination-title">{nextRecipe.title}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          ) : <div />}
        </nav>
      </div>
    </main>
  )
}
