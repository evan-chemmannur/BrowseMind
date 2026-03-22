import { useEffect } from 'react'

export default function CursorGlow() {
  useEffect(() => {
    const glow = document.getElementById('cursor-glow')
    if (!glow) return

    const onMove = (e) => {
      glow.style.left = e.clientX + 'px'
      glow.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return <div id="cursor-glow" aria-hidden="true" />
}
