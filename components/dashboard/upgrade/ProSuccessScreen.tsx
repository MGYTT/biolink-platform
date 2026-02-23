'use client'

import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/badge'
import {
  Crown, Sparkles, ArrowRight, Zap, Globe,
  Palette, BarChart2, Lock, Layers, Shield,
} from 'lucide-react'
import Link from 'next/link'

const PRO_PERKS = [
  { icon: Layers,    text: 'Nieograniczone strony i bloki'          },
  { icon: Zap,       text: 'Wszystkie 14 typów bloków'              },
  { icon: Globe,     text: 'Własna domena'                          },
  { icon: Palette,   text: 'Zaawansowane motywy i gradienty'        },
  { icon: BarChart2, text: 'Szczegółowa analityka'                  },
  { icon: Lock,      text: 'Harmonogram linków'                     },
  { icon: Shield,    text: 'Meta Pixel & Google Tag Manager'        },
  { icon: Sparkles,  text: 'White-label (bez brandingu BioLink)'    },
]

export function ProSuccessScreen() {
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(true)
  const [confettiPieces, setConfettiPieces] = useState(300)

  /* Stopniowo redukuj confetti → wygaszenie */
  useEffect(() => {
    const fadeTimer = setTimeout(() => setConfettiPieces(0), 3500)
    const stopTimer = setTimeout(() => setShowConfetti(false), 7000)
    return () => { clearTimeout(fadeTimer); clearTimeout(stopTimer) }
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={confettiPieces}
          recycle={false}
          gravity={0.18}
          colors={['#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#10b981', '#f97316']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 50, pointerEvents: 'none' }}
        />
      )}

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full mx-auto px-6 py-12 text-center">

        {/* Crown icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-300/40 dark:shadow-amber-700/40">
              <Crown className="h-12 w-12 text-white" />
            </div>
            {/* Orbiting sparkles */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ delay: 0.3 + i * 0.1, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                className="absolute w-3 h-3"
                style={{
                  top:  `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 52}px - 6px)`,
                  left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 52}px - 6px)`,
                }}
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 mb-4">
            ⭐ Plan Pro Aktywny
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Witaj w Pro! 🎉
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Twoje konto zostało pomyślnie zaktualizowane. Wszystkie funkcje Pro są już dostępne.
          </p>
        </motion.div>

        {/* Perks list */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 rounded-2xl border bg-card p-5 text-left space-y-2.5 shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Co teraz możesz robić
          </p>
          {PRO_PERKS.map((perk, i) => (
            <motion.div
              key={perk.text}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.06 }}
              className="flex items-center gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center flex-shrink-0">
                <perk.icon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </span>
              <span className="text-sm">{perk.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          <Button asChild className="flex-1 gap-2 font-bold shadow-lg shadow-primary/20" size="lg">
            <Link href="/dashboard">
              Przejdź do dashboardu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 gap-2" size="lg">
            <Link href="/dashboard/pages/new">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Stwórz stronę Pro
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
