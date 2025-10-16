import React from 'react'
import { motion } from 'framer-motion'

// Square: botón simple que muestra X/O y tiene animación al aparecer
export default function Square({ value, onClick }){
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg shadow flex items-center justify-center text-2xl font-bold text-gray-800">
      <motion.span initial={{ scale: 0 }} animate={{ scale: value ? 1 : 0 }} transition={{ type: 'spring', stiffness: 300 }} className={value === 'X' ? 'text-indigo-600' : 'text-pink-500'}>
        {value}
      </motion.span>
    </motion.button>
  )
}
