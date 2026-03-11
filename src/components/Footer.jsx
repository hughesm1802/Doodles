import { Link } from 'react-router-dom'
import { categories } from '../data/recipes'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Link to="/" className="site-logo footer-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">
              <span className="logo-primary">The Culinary</span>
              <span className="logo-secondary">Ebook</span>
            </span>
          </Link>
          <p className="footer-tagline">
            Discover recipes with step-by-step video guides, curated ingredients, and full nutritional breakdowns.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            {categories.map(cat => (
              <li key={cat.id}>
                <Link to={`/category/${cat.id}`}>
                  {cat.icon} {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Navigate</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contents">Table of Contents</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">About</h4>
          <p className="footer-about-text">
            All recipes are written by experienced chefs and culinary educators.
            Nutritional values are calculated per serving using standard USDA food data.
            Video guides are embedded from YouTube and remain the property of their respective creators.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} The Culinary Ebook. All recipe content is for personal, non-commercial use.
          </p>
          <p className="footer-note">
            Nutritional information is approximate. Always consult a healthcare professional for dietary advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
