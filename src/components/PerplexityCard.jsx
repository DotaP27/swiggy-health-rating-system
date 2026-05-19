import React from 'react'

export default function PerplexityCard({url}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,background:'#fff',padding:12,borderRadius:8,border:'1px solid #e6e6e6'}}>
      <div style={{width:120,height:80,background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,color:'#6b7280'}}>Screenshot</div>
      <div>
        <div style={{fontWeight:700}}>Perplexity Computer Example</div>
        <div style={{color:'#6b7280',fontSize:13}}>Source: Perplexity Computer — click to open the example in a new tab.</div>
        <a href={url} target="_blank" rel="noreferrer" style={{display:'inline-block',marginTop:8}}>Open example</a>
      </div>
    </div>
  )
}
