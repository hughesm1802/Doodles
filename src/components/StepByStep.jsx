import { useState } from 'react'

export default function StepByStep({ steps }) {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [activeStep, setActiveStep] = useState(null)
  const [expandedTips, setExpandedTips] = useState(new Set())

  function toggleStep(stepNum) {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      next.has(stepNum) ? next.delete(stepNum) : next.add(stepNum)
      return next
    })
  }

  function toggleTip(stepNum) {
    setExpandedTips(prev => {
      const next = new Set(prev)
      next.has(stepNum) ? next.delete(stepNum) : next.add(stepNum)
      return next
    })
  }

  function goToStep(n) {
    setActiveStep(n)
    // Scroll to step
    const el = document.getElementById(`step-${n}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const completedCount = completedSteps.size
  const totalSteps = steps.length
  const progressPercent = (completedCount / totalSteps) * 100

  return (
    <section className="steps-section" id="instructions">
      <div className="steps-section-header">
        <div className="steps-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h2 className="steps-section-title">Step-by-Step Instructions</h2>
          <p className="steps-section-desc">
            {completedCount === 0
              ? `${totalSteps} steps — click each step when done`
              : completedCount === totalSteps
                ? 'All steps complete! Enjoy your dish.'
                : `${completedCount} of ${totalSteps} steps completed`}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="steps-progress-container">
        <div
          className="steps-progress-bar"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemax={totalSteps}
          aria-label={`${completedCount} of ${totalSteps} steps completed`}
        />
        <span className="steps-progress-label">{Math.round(progressPercent)}%</span>
      </div>

      {/* Quick nav */}
      <nav className="steps-quick-nav" aria-label="Step navigation">
        {steps.map(s => (
          <button
            key={s.step}
            className={`step-nav-dot ${completedSteps.has(s.step) ? 'dot-done' : ''} ${activeStep === s.step ? 'dot-active' : ''}`}
            onClick={() => goToStep(s.step)}
            aria-label={`Go to step ${s.step}: ${s.title}`}
            title={`Step ${s.step}: ${s.title}`}
          >
            {completedSteps.has(s.step) ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" width="10" height="10">
                <path fillRule="evenodd" d="M10.53 2.47a.75.75 0 010 1.06L4.59 9.47 1.47 6.35a.75.75 0 011.06-1.06l2.06 2.06 5.88-5.88a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
            ) : (
              s.step
            )}
          </button>
        ))}
      </nav>

      {/* Steps */}
      <ol className="steps-list">
        {steps.map(s => {
          const done = completedSteps.has(s.step)
          const active = activeStep === s.step
          const tipOpen = expandedTips.has(s.step)

          return (
            <li
              key={s.step}
              id={`step-${s.step}`}
              className={`step-item ${done ? 'step-done' : ''} ${active ? 'step-active' : ''}`}
            >
              <div className="step-marker-col">
                <button
                  className={`step-circle ${done ? 'step-circle-done' : ''}`}
                  onClick={() => toggleStep(s.step)}
                  aria-pressed={done}
                  aria-label={done ? `Mark step ${s.step} incomplete` : `Mark step ${s.step} complete`}
                  title={done ? 'Click to unmark' : 'Click to mark complete'}
                >
                  {done ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="step-num">{s.step}</span>
                  )}
                </button>
                {s.step < steps.length && <div className={`step-connector ${done ? 'connector-done' : ''}`} />}
              </div>

              <div className="step-content" onClick={() => setActiveStep(active ? null : s.step)}>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-instruction">{s.instruction}</p>

                {s.image && (
                  <img src={s.image} alt={`Step ${s.step} illustration`} className="step-image" loading="lazy" />
                )}

                {s.tip && (
                  <div className="step-tip-container">
                    <button
                      className="step-tip-toggle"
                      onClick={e => { e.stopPropagation(); toggleTip(s.step) }}
                      aria-expanded={tipOpen}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {tipOpen ? 'Hide tip' : 'Chef\'s tip'}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width="12"
                        height="12"
                        className={`tip-chevron ${tipOpen ? 'tip-chevron-open' : ''}`}
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {tipOpen && (
                      <div className="step-tip-content" role="note">
                        <span className="tip-label">Tip:</span> {s.tip}
                      </div>
                    )}
                  </div>
                )}

                <button
                  className={`step-done-btn ${done ? 'step-done-btn-active' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleStep(s.step) }}
                  aria-pressed={done}
                >
                  {done ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="13" height="13">
                        <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                      </svg>
                      Done
                    </>
                  ) : 'Mark as done'}
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      {completedCount === totalSteps && (
        <div className="steps-complete-banner" role="status">
          <span className="complete-icon">🎉</span>
          <div>
            <strong>All steps complete!</strong>
            <p>Your dish is ready. Bon appétit!</p>
          </div>
        </div>
      )}
    </section>
  )
}
