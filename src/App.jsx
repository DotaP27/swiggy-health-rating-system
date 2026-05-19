import React from 'react'
import products from './mock/products.json'
import GradeChip from './components/GradeChip'
import { scoreProduct } from '../src/scoring.js'

export default function App() {
  return (
    <div className="app">
      <header><h1>Instamart Health Rater — Demo</h1></header>
      <main>
        <ul className="product-list">
          {products.map(p => {
            const nutrients = p.nutrients || {}
            const result = scoreProduct(nutrients, p.ingredients || '')
            return (
              <li key={p.id} className="product">
                <div className="meta">
                  <strong>{p.name}</strong>
                  <div className="desc">{p.brand}</div>
                </div>
                <div className="chip-wrap">
                  <GradeChip score={result.score} grade={result.grade} breakdown={result.breakdown} />
                </div>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
