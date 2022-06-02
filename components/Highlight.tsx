import React from 'react'

/**
 * @TODO add real highlighting for hover
 * @TODO add click to show 
 */
export default function Highlight({text}: {text:string}) {
  return (
    <span className="highlight">{text}</span>
  )
}
