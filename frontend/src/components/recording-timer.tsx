import React, { useEffect, useState } from 'react'

interface TimerProps {
  startTimeISO: string // ISO8601 string, e.g., "2024-07-17T12:00:00Z"
}

const RecordingTimer: React.FC<TimerProps> = ({ startTimeISO }) => {
  const startDate = new Date(startTimeISO)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    Math.floor((Date.now() - startDate.getTime()) / 1000)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startDate.getTime()) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTimeISO])

  // Format the time as H:MM:SS
  const hours = Math.floor(elapsedSeconds / 3600)
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
  const seconds = elapsedSeconds % 60

  const formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`

  return <span>{formatted}</span>
}

export default RecordingTimer
