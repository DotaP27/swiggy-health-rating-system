import React, {useState} from 'react'

function colorForGrade(g) {
  switch (g) {
    case 'A': return '#1b7a3a'
    case 'B': return '#0b9f6b'
    case 'C': return '#f59e0b'
    case 'D': return '#f97316'
    default: return '#dc2626'
  }
}

export default function GradeChip({score, grade, breakdown}){
  const [show, setShow] = useState(false)
  const color = colorForGrade(grade)
  return (
    <div className="grade-chip" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} style={{borderColor: color}}>
      <span className="grade-letter" style={{background: color}}>{grade}</span>
      <span className="grade-score">{score}</span>
      {show && (
        <div className="tooltip">
          <div>Score: {score}</div>
          <div>Protein: {breakdown.protein}</div>
          <div>Fiber: {breakdown.fiber}</div>
          <div>Sugar: {breakdown.sugar}</div>
        </div>
      )}
    </div>
  )
}
