import React, { useState } from 'react'
import Board from './components/Board.jsx'
import Scoreboard from './components/Scoreboard.jsx'
import ResetButton from './components/ResetButton.jsx'

// App principal: layout, theme y estado global simple (puntajes)
export default function App(){
  const [scores, setScores] = useState({ X:0, O:0 })

  const handleWin = (winner) => {
    if(winner === 'X' || winner === 'O'){
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6" style={{background: 'linear-gradient(180deg, #ffffff, #fbfdff)'}}>
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🎯 Tic Tac Toe</h1>
          <p className="text-sm text-gray-500 mt-1">Juego en tonos suaves — React + Socket (opcional)</p>
        </header>

        <Scoreboard scores={scores} />

        <main className="flex justify-center my-4">
          <Board onWin={handleWin} />
        </main>

        <footer className="flex justify-center mt-6">
          <ResetButton />
        </footer>
      </div>
    </div>
  )
}
