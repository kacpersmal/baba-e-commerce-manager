import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'

function getTimeUntilMidnight() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  
  const diff = midnight.getTime() - now.getTime()
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
}

export function CountdownTimer() {
  const [time, setTime] = useState(getTimeUntilMidnight())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnight())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-violet-500/50 bg-linear-to-r from-purple-500/20 via-violet-500/20 to-fuchsia-500/20 px-6 py-4 backdrop-blur-sm">
      <div className="absolute inset-0 animate-pulse bg-linear-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10" />
      <div className="relative flex items-center gap-3">
        <Flame className="h-6 w-6 shrink-0 animate-pulse text-violet-500" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">
            Kończy się za
          </span>
          <span className="inline-block min-w-[5rem] font-mono text-2xl font-bold tabular-nums text-violet-400">
            {time.hours}:{time.minutes}:{time.seconds}
          </span>
        </div>
      </div>
    </div>
  )
}

