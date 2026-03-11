import { useState } from 'react'

export default function NutritionInfo({ nutrition, currentServings, defaultServings }) {
  const [showDetails, setShowDetails] = useState(true)
  const scale = currentServings / defaultServings

  const scaledCalories = Math.round(nutrition.calories * scale)

  function scaleValue(value) {
    const match = value.match(/^([\d.]+)(.*)$/)
    if (!match) return value
    const num = parseFloat(match[1])
    const unit = match[2]
    const scaled = num * scale
    const formatted = scaled % 1 === 0 ? scaled.toString() : parseFloat(scaled.toFixed(1)).toString()
    return `${formatted}${unit}`
  }

  return (
    <section className="nutrition-section" id="nutrition">
      <div className="nutrition-section-header">
        <div className="nutrition-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
          </svg>
        </div>
        <div>
          <h2 className="nutrition-section-title">Nutritional Information</h2>
          <p className="nutrition-section-desc">Per serving: {nutrition.servingSize}</p>
        </div>
      </div>

      {/* Calorie spotlight */}
      <div className="calorie-spotlight">
        <div className="calorie-circle">
          <svg viewBox="0 0 100 100" className="calorie-ring">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 42 * 0.72} ${2 * Math.PI * 42 * 0.28}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="calorie-inner">
            <span className="calorie-number">{scaledCalories}</span>
            <span className="calorie-unit">kcal</span>
          </div>
        </div>
        <div className="calorie-breakdown">
          {nutrition.macros.filter(m => ['Protein', 'Carbohydrates', 'Total Fat'].includes(m.label)).map(m => (
            <div key={m.label} className="calorie-macro">
              <div className="macro-swatch" style={{ background: m.color }} />
              <div className="macro-detail">
                <span className="macro-value">{scaleValue(m.value)}</span>
                <span className="macro-label">{m.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle details */}
      <button
        className="nutrition-toggle"
        onClick={() => setShowDetails(d => !d)}
        aria-expanded={showDetails}
      >
        {showDetails ? 'Hide full nutrition facts' : 'Show full nutrition facts'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          width="16"
          height="16"
          className={`nutrition-chevron ${showDetails ? 'chevron-open' : ''}`}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {showDetails && (
        <div className="nutrition-details">
          {/* Nutrition facts label */}
          <div className="nutrition-label">
            <div className="nf-header">
              <h3>Nutrition Facts</h3>
              <p>{currentServings} serving{currentServings !== 1 ? 's' : ''}</p>
            </div>
            <div className="nf-calories-row">
              <span>Calories</span>
              <span className="nf-cal-value">{scaledCalories}</span>
            </div>
            <div className="nf-divider-thin" />
            <p className="nf-dv-note">% Daily Value*</p>

            {nutrition.macros.map(macro => (
              <div key={macro.label} className="nf-row">
                <div className="nf-row-left">
                  <div
                    className="nf-bar"
                    style={{ '--bar-color': macro.color, '--bar-width': `${Math.min(macro.percent, 100)}%` }}
                  />
                  <span className="nf-macro-label">{macro.label}</span>
                  <span className="nf-macro-value">{scaleValue(macro.value)}</span>
                </div>
                <span className={`nf-dv ${macro.percent >= 20 ? 'dv-high' : macro.percent <= 5 ? 'dv-low' : ''}`}>
                  {macro.percent}%
                </span>
              </div>
            ))}

            {nutrition.vitamins && nutrition.vitamins.length > 0 && (
              <>
                <div className="nf-divider" />
                <div className="nf-vitamins">
                  {nutrition.vitamins.map(v => (
                    <div key={v.label} className="nf-vitamin-item">
                      <span className="nf-vitamin-label">{v.label}</span>
                      <span className="nf-vitamin-value">{v.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="nf-footnote">
              *Percent Daily Values are based on a 2,000 calorie diet.
              Your daily values may be higher or lower depending on your calorie needs.
            </div>
          </div>

          {/* Allergens */}
          {nutrition.allergens && nutrition.allergens.length > 0 && (
            <div className="allergen-section">
              <h4 className="allergen-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Allergen Information
              </h4>
              <p className="allergen-warning">
                This recipe contains or may contain:
              </p>
              <div className="allergen-tags">
                {nutrition.allergens.map(a => (
                  <span key={a} className="allergen-tag">{a}</span>
                ))}
              </div>
              <p className="allergen-note">
                Always check individual ingredient labels. Preparation methods and cross-contamination may affect suitability for those with allergies or intolerances.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
