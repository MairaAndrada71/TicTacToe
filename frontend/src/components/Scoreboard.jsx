import React from 'react'

export default function Scoreboard({ scores }){
  return (
    <div className="flex justify-center gap-4 mb-4">
      <div className="px-4 py-2 bg-white rounded-lg shadow text-center">
        <div className="text-sm text-gray-500">Jugador X</div>
        <div className="text-xl font-semibold text-indigo-600">{scores.X}</div>
      </div>
      <div className="px-4 py-2 bg-white rounded-lg shadow text-center">
        <div className="text-sm text-gray-500">Jugador O</div>
        <div className="text-xl font-semibold text-pink-600">{scores.O}</div>
      </div>
    </div>
  )
}
