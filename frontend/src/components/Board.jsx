import React, { useState, useEffect } from 'react'
import Square from './Square.jsx'
import { calculateWinner } from '../utils/gameLogic.js'
import { motion } from 'framer-motion'

// Board: maneja estado local del tablero, turno y llama a onWin cuando hay ganador
export default function Board({ onWin }){
  const [board, setBoard] = useState(Array(9).fill(''))
  const [turn, setTurn] = useState('X')
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    const w = calculateWinner(board)
    if(w){
      setWinner(w)
      onWin(w)
    } else if(!board.includes('')){
      setWinner('Draw')
    }
  }, [board])

  const handleClick = (index) => {
    if(board[index] || winner) return
    setBoard(prev => {
      const copy = prev.slice()
      copy[index] = turn
      return copy
    })
    setTurn(t => t === 'X' ? 'O' : 'X')
  }

  const handleReset = () => {
    setBoard(Array(9).fill(''))
    setTurn('X')
    setWinner(null)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 text-gray-600">{ winner ? (winner==='Draw' ? 'Empate 🤝' : `🎉 Gana ${winner}`) : `Turno: ${turn}` }</div>

      <motion.div className="grid grid-cols-3 gap-3 p-4 bg-board rounded-xl shadow-inner"
        initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
        {board.map((val, i) => (
          <Square key={i} value={val} onClick={() => handleClick(i)} />
        ))}
      </motion.div>

      <div className="mt-4">
        <button onClick={handleReset} className="px-4 py-2 bg-white rounded-lg shadow hover:scale-105 transition">Reiniciar</button>
      </div>
    </div>
  )
}
