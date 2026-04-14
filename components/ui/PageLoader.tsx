'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-teal to-brand-orange opacity-20 blur-xl" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-teal to-brand-orange">
            <span className="text-2xl font-bold text-white">TF</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </motion.div>
    </motion.div>
  )
}
