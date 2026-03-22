import { useEffect, useRef } from 'react'

export default function DealScoreRing({ score = 0, size = 96, strokeWidth = 8 }) {
  const arcRef = useRef(null)

  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const cx = size / 2
  const cy = size / 2

  // Color: red(0) → orange → cyan(100)
  const lerp = (a, b, t) => a + (b - a) * t
  const t = score / 100
  const r1 = Math.round(lerp(239, 6, t))
  const g1 = Math.round(lerp(68, 182, t))
  const b1 = Math.round(lerp(68, 212, t))
  const color = `rgb(${r1},${g1},${b1})`

  useEffect(() => {
    const arc = arcRef.current
    if (!arc) return
    const targetOffset = circumference * (1 - score / 100)
    arc.style.strokeDashoffset = circumference  // start at 0
    const tick = setTimeout(() => {
      arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)'
      arc.style.strokeDashoffset = targetOffset
    }, 100)
    return () => clearTimeout(tick)
  }, [score, circumference])

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Arc */}
        <circle
          ref={arcRef}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      {/* Score label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: size * 0.22 + 'px',
          fontWeight: 600,
          color,
          lineHeight: 1
        }}>{score}</span>
        <span style={{
          fontSize: size * 0.12 + 'px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          fontWeight: 500
        }}>Deal</span>
      </div>
    </div>
  )
}
