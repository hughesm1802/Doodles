import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomePage from './components/HomePage'
import ContentsPage from './components/ContentsPage'
import CategoryPage from './components/CategoryPage'
import RecipePage from './components/RecipePage'
import SearchPage from './components/SearchPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />
      <div className="app-main">
        <Routes>
          <Route path="/"                     element={<HomePage />} />
          <Route path="/contents"             element={<ContentsPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/recipe/:id"           element={<RecipePage />} />
          <Route path="/search"               element={<SearchPage />} />
          <Route path="*"                     element={<NotFound />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

function NotFound() {
  return (
    <div className="not-found container">
      <h1>404 — Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  )
}
