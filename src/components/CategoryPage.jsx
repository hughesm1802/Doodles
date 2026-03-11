import { useParams, Link } from 'react-router-dom'
import { categories } from '../data/recipes'
import TableOfContents from './TableOfContents'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const category = categories.find(c => c.id === categoryId)

  if (!category) {
    return (
      <main className="not-found container">
        <h1>Category Not Found</h1>
        <p>The category you are looking for does not exist.</p>
        <Link to="/contents" className="btn btn-primary">Browse All Recipes</Link>
      </main>
    )
  }

  return (
    <main className="category-page">
      <div className="category-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/contents">Recipes</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{category.label}</span>
          </nav>
          <div className="category-hero-icon">{category.icon}</div>
          <h1 className="category-hero-title">{category.label} Recipes</h1>
          <p className="category-hero-subtitle">
            Explore our curated collection of {category.label.toLowerCase()} recipes, each with video guides and full nutritional information.
          </p>
        </div>
      </div>

      <div className="container category-body">
        <TableOfContents filterCategory={categoryId} />
      </div>
    </main>
  )
}
