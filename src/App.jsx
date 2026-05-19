import React, { useState, useEffect } from 'react'
import { calculateHealthScore } from './scoring.js'
import sampleProducts from './mock/products.json'
import './styles.css'

export default function App() {
  const [form, setForm] = useState({
    productName: 'Greek Yogurt', category: 'Dairy', calories: 97, protein: 10, fiber: 0, sugar: 4, satFat: 1.5, sodium: 55,
    ingredients: 'Milk solids, live cultures, no artificial sweeteners, no palm oil.'
  })
  const [result, setResult] = useState(() => calculateHealthScore(form))

  useEffect(() => { setResult(calculateHealthScore(form)) }, [form])

  function onChange(e) {
    const { id, value } = e.target
    const numeric = ['calories','protein','fiber','sugar','satFat','sodium']
    setForm(prev => ({ ...prev, [id]: numeric.includes(id) ? Number(value || 0) : value }))
  }

  function loadSample(i) { setForm(sampleProducts[i]) }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">HR</div>
          <div>
            <h1>Health Rater</h1>
            <p>Instamart product scoring</p>
          </div>
        </div>
        <nav className="nav-group">
          <div className="nav-label">Sections</div>
          <a className="nav-link active" href="#overview">Overview</a>
          <a className="nav-link" href="#calculator">Calculator</a>
          <a className="nav-link" href="#examples">Examples</a>
          <a className="nav-link" href="#framework">Framework</a>
        </nav>
        <div style={{marginTop:'auto'}}>
          <div className="sidebar-card">Use this score inside a grocery app to help users compare items quickly.</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{display:'flex',alignItems:'flex-start',gap:'1rem'}}>
            <div className="topbar-title">
              <h2>Health score system for Instamart</h2>
              <p>A simple product-rating model that turns nutrition facts into an easy A to E grade.</p>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="pill">Better-for-you filter</div>
            <div className="pill">Per 100 g basis</div>
            <div className="pill">Explainable scoring</div>
          </div>
        </header>

        <div className="content">
          <section className="hero" id="overview">
            <article className="hero-card">
              <div className="eyebrow">Product concept</div>
              <h3>Rate every Instamart item by health, not just price.</h3>
              <p>This concept gives each product a clear score out of 100, an A to E grade, and short reasons so users can make faster grocery choices.</p>
              <div className="hero-metrics">
                <div className="metric"><strong>100</strong><span>Total score scale</span></div>
                <div className="metric"><strong>5</strong><span>Grade bands A–E</span></div>
                <div className="metric"><strong>6</strong><span>Main nutrition inputs</span></div>
              </div>
            </article>

            <aside className="hero-card scoring-card">
              <h3>Grade bands</h3>
              <div className="score-legend">
                <div className="legend-row"><span className="grade-chip" style={{background:'var(--color-score-a)'}}>A</span><span>Excellent everyday choice</span><strong>80–100</strong></div>
                <div className="legend-row"><span className="grade-chip" style={{background:'var(--color-score-b)'}}>B</span><span>Good choice, minor caution</span><strong>65–79</strong></div>
                <div className="legend-row"><span className="grade-chip" style={{background:'var(--color-score-c)'}}>C</span><span>Okay sometimes</span><strong>50–64</strong></div>
                <div className="legend-row"><span className="grade-chip" style={{background:'var(--color-score-d)'}}>D</span><span>Low health quality</span><strong>35–49</strong></div>
                <div className="legend-row"><span className="grade-chip" style={{background:'var(--color-score-e)'}}>E</span><span>Limit or avoid</span><strong>0–34</strong></div>
              </div>
            </aside>
          </section>

          <section className="grid-2" id="calculator">
            <section className="panel">
              <div>
                <h3>Health score calculator</h3>
                <p className="helper">Enter values per 100 g so products can be compared fairly across brands.</p>
              </div>

              <form id="ratingForm" className="form-grid" onSubmit={e => { e.preventDefault(); setResult(calculateHealthScore(form)) }}>
                <div className="field"><label htmlFor="productName">Product name</label><input id="productName" value={form.productName} onChange={onChange} /></div>
                <div className="field"><label htmlFor="category">Category</label><select id="category" value={form.category} onChange={onChange}><option>Dairy</option><option>Snacks</option><option>Beverages</option><option>Breakfast</option><option>Staples</option></select></div>
                <div className="field"><label htmlFor="calories">Calories</label><input id="calories" type="number" value={form.calories} onChange={onChange} /></div>
                <div className="field"><label htmlFor="protein">Protein (g)</label><input id="protein" type="number" value={form.protein} onChange={onChange} /></div>
                <div className="field"><label htmlFor="fiber">Fiber (g)</label><input id="fiber" type="number" value={form.fiber} onChange={onChange} /></div>
                <div className="field"><label htmlFor="sugar">Sugar (g)</label><input id="sugar" type="number" value={form.sugar} onChange={onChange} /></div>
                <div className="field"><label htmlFor="satFat">Saturated fat (g)</label><input id="satFat" type="number" step="0.1" value={form.satFat} onChange={onChange} /></div>
                <div className="field"><label htmlFor="sodium">Sodium (mg)</label><input id="sodium" type="number" value={form.sodium} onChange={onChange} /></div>
                <div className="field full"><label htmlFor="ingredients">Ingredient notes</label><textarea id="ingredients" value={form.ingredients} onChange={onChange} /></div>

                <div className="field full"><div className="button-row"><button className="btn btn-primary" type="submit">Calculate rating</button><button type="button" className="btn btn-secondary" onClick={() => loadSample(2)}>Load snack sample</button></div></div>
              </form>
            </section>

            <aside className="panel result-card">
              <div>
                <h3>Rating result</h3>
                <p className="helper">Make the score visible on product cards, listing pages, and search filters.</p>
              </div>

              <div className="score-box">
                <div className="score-top">
                  <div>
                    <div className="score-value">{result.score}</div>
                    <div className="score-sub">{form.productName} — {result.gradeText}</div>
                  </div>
                  <div className="grade-chip" style={{background:result.color}}>{result.grade}</div>
                </div>
                <div className="meter" aria-hidden="true"><div className="meter-fill" style={{width:result.score+'%', background:result.color}}></div></div>
              </div>

              <div>
                <h3 style={{fontSize:'var(--text-base)', marginBottom:'.75rem'}}>Why this score?</h3>
                <ul className="reason-list">{result.reasons.map((r,i)=><li key={i}>{r}</li>)}</ul>
              </div>
            </aside>
          </section>

          <section id="examples">
            <div style={{marginBottom:'1rem'}}><h3 style={{margin:0,fontSize:'var(--text-lg)'}}>Example product ratings</h3><p className="helper">These examples show how the framework works.</p></div>
            <div className="products-grid">{sampleProducts.map((p, idx) => { const res = calculateHealthScore(p); return (
              <article key={idx} className="product-card">
                <div className="product-top"><div><h3>{p.productName}</h3><div className="product-meta">{p.category}</div></div><div className="grade-chip" style={{background:res.color}}>{res.grade}</div></div>
                <div className="score-sub">Score {res.score}/100</div>
                <div className="tags"><span className="tag">Protein {p.protein}g</span><span className="tag">Sugar {p.sugar}g</span><span className="tag">Sodium {p.sodium}mg</span></div>
                <div className="helper">{res.reasons[0] || res.gradeText}</div>
              </article>
            )})}</div>
          </section>
        </div>
      </main>
    </div>
  )
}
