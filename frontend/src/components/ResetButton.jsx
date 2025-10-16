import React from 'react'

export default function ResetButton(){
  const handle = () => window.location.reload()
  return (
    <button onClick={handle} className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition">
      🔄 Reiniciar Juego
    </button>
  )
}
