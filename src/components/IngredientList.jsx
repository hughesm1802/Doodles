import { useState } from 'react'

export default function IngredientList({ ingredients, defaultServings, currentServings, onServingsChange }) {
  const [checkedItems, setCheckedItems] = useState(new Set())
  const [copiedAll, setCopiedAll] = useState(false)

  const scale = currentServings / defaultServings

  function toggleItem(key) {
    setCheckedItems(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function clearChecks() {
    setCheckedItems(new Set())
  }

  function scaleAmount(amount) {
    if (!amount || amount === 'to taste' || amount === 'as needed' || amount === 'to dust') return amount
    // Extract number from string like "400 g", "2 tbsp", "3", "1/2", "1.5 kg"
    const match = amount.match(/^([\d./\s]+)(.*)$/)
    if (!match) return amount
    const numStr = match[1].trim()
    const unit = match[2]

    // Handle fractions
    let num
    if (numStr.includes('/')) {
      const parts = numStr.split('/').map(Number)
      num = parts[0] / parts[1]
    } else {
      num = parseFloat(numStr)
    }

    if (isNaN(num)) return amount
    const scaled = num * scale

    // Format nicely: no unnecessary decimals
    let formatted
    if (scaled === Math.floor(scaled)) {
      formatted = scaled.toString()
    } else if (Math.abs(scaled - Math.round(scaled * 4) / 4) < 0.01) {
      // round to nearest quarter
      const q = Math.round(scaled * 4) / 4
      const whole = Math.floor(q)
      const frac = q - whole
      const fracMap = { 0.25: '¼', 0.5: '½', 0.75: '¾', 0: '' }
      formatted = (whole > 0 ? whole : '') + (fracMap[frac] || '')
      if (!formatted) formatted = scaled.toFixed(1)
    } else {
      formatted = scaled % 1 === 0 ? scaled.toString() : parseFloat(scaled.toFixed(1)).toString()
    }

    return `${formatted}${unit}`
  }

  function buildShoppingList() {
    const lines = []
    ingredients.forEach(group => {
      lines.push(`\n## ${group.group}`)
      group.items.forEach(item => {
        const scaled = scaleAmount(item.amount)
        lines.push(`- ${scaled} ${item.item}${item.note ? ` (${item.note})` : ''}`)
      })
    })
    return lines.join('\n').trim()
  }

  async function copyShoppingList() {
    try {
      await navigator.clipboard.writeText(buildShoppingList())
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch {
      // fallback: select a textarea
    }
  }

  const totalItems = ingredients.reduce((sum, g) => sum + g.items.length, 0)
  const checkedCount = checkedItems.size

  return (
    <section className="ingredient-section" id="ingredients">
      <div className="ingredient-section-header">
        <div className="ingredient-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h2 className="ingredient-section-title">Ingredients</h2>
          <p className="ingredient-section-desc">
            {checkedCount > 0 ? `${checkedCount} of ${totalItems} items checked` : `${totalItems} ingredients`}
          </p>
        </div>
      </div>

      {/* Servings adjuster */}
      <div className="servings-adjuster">
        <span className="servings-label">Servings:</span>
        <div className="servings-controls">
          <button
            className="servings-btn"
            onClick={() => onServingsChange(Math.max(1, currentServings - 1))}
            aria-label="Decrease servings"
            disabled={currentServings <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="servings-value" aria-live="polite">{currentServings}</span>
          <button
            className="servings-btn"
            onClick={() => onServingsChange(currentServings + 1)}
            aria-label="Increase servings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </button>
        </div>
        {scale !== 1 && (
          <span className="servings-scale-badge">
            {scale > 1 ? `×${scale.toFixed(scale % 1 === 0 ? 0 : 1)}` : `÷${(1 / scale).toFixed(1)}`} scale
          </span>
        )}
      </div>

      {/* Progress bar */}
      {checkedCount > 0 && (
        <div className="ingredient-progress" role="progressbar" aria-valuenow={checkedCount} aria-valuemax={totalItems}>
          <div className="ingredient-progress-bar" style={{ width: `${(checkedCount / totalItems) * 100}%` }} />
        </div>
      )}

      {/* Ingredient groups */}
      <div className="ingredient-groups">
        {ingredients.map(group => (
          <div key={group.group} className="ingredient-group">
            <h3 className="ingredient-group-title">{group.group}</h3>
            <ul className="ingredient-list">
              {group.items.map(item => {
                const key = `${group.group}-${item.item}`
                const checked = checkedItems.has(key)
                return (
                  <li
                    key={key}
                    className={`ingredient-item ${checked ? 'ingredient-checked' : ''}`}
                    onClick={() => toggleItem(key)}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? toggleItem(key) : null}
                  >
                    <span className="ingredient-checkbox" aria-hidden="true">
                      {checked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <span className="ingredient-amount">{scaleAmount(item.amount)}</span>
                    <span className="ingredient-name">{item.item}</span>
                    {item.note && <span className="ingredient-note">{item.note}</span>}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="ingredient-actions">
        {checkedCount > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={clearChecks}>
            Clear all checks
          </button>
        )}
        <button
          className={`btn btn-sm btn-outline ${copiedAll ? 'btn-success' : ''}`}
          onClick={copyShoppingList}
        >
          {copiedAll ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
              </svg>
              Copy shopping list
            </>
          )}
        </button>
      </div>
    </section>
  )
}
