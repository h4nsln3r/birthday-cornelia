import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import GiftBox from './components/GiftBox'
import StatsCard from './components/StatsCard'
import FinalCard from './components/FinalCard'
import './App.scss'

type Stage = 'closed' | 'days' | 'hours' | 'beers' | 'final'

function computeStats() {
  const birth = new Date('1996-08-04T00:00:00')
  const now = new Date()
  const ms = now.getTime() - birth.getTime()
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor(ms / 3_600_000)

  // Beer estimate: assumed she started at 16 (2012-08-04), avg 4 beers/week
  const beerStart = new Date('2012-08-04T00:00:00')
  const beerDays = Math.floor((now.getTime() - beerStart.getTime()) / 86_400_000)
  const beers = Math.floor(beerDays * 4 / 7)

  return { days, hours, beers }
}

export default function App() {
  const [stage, setStage] = useState<Stage>('closed')
  const stats = computeStats()

  return (
    <div className="app">
      <div className="scanlines" />
      <div className="bg-grid" />
      <AnimatePresence mode="wait">
        {stage === 'closed' && (
          <GiftBox key="box" onOpened={() => setStage('days')} />
        )}
        {stage === 'days' && (
          <StatsCard
            key="days"
            value={stats.days}
            unit="dagar"
            subtitle="Cornelia har levt på denna vackra jord"
            accent="cyan"
            onNext={() => setStage('hours')}
          />
        )}
        {stage === 'hours' && (
          <StatsCard
            key="hours"
            value={stats.hours}
            unit="timmar"
            subtitle="av äventyr, skratt och minnen"
            accent="pink"
            onNext={() => setStage('beers')}
          />
        )}
        {stage === 'beers' && (
          <StatsCard
            key="beers"
            value={stats.beers}
            unit="öl"
            subtitle="ungefärlig uppskattning™  (±420)"
            extra={'baserat på vetenskapliga gissningar sedan "18-årsdagen"'}
            note="(det är ca 4 öl i veckan)"
            accent="lime"
            onNext={() => setStage('final')}
          />
        )}
        {stage === 'final' && (
          <FinalCard key="final" />
        )}
      </AnimatePresence>
    </div>
  )
}
