import { Link } from 'react-router-dom'
import TableOfContents from './TableOfContents'

export default function ContentsPage() {
  return (
    <main className="contents-page">
      <div className="contents-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">All Recipes</span>
          </nav>
          <h1 className="contents-hero-title">Recipe Directory</h1>
          <p className="contents-hero-subtitle">
            Browse all recipes by cuisine, filter by difficulty, or sort by cooking time.
            Every recipe includes a video guide, full ingredient list, step-by-step instructions, and nutritional data.
          </p>
        </div>
      </div>
      <div className="container contents-body">
        <TableOfContents />
      </div>
    </main>
  )
}
