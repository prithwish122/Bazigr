"use client"

import * as React from "react"
import { cn } from "@/app/lib/utils"

type ScratchCardProps = {
  rewardText: string // e.g., "7 BAZ"
  width?: number
  height?: number
  onRevealComplete?: () => void
}

export function ScratchCard({ rewardText, width = 320, height = 180, onRevealComplete }: ScratchCardProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null)
  const drawingRef = React.useRef(false)
  const [revealed, setRevealed] = React.useState(false)

  // setup overlay
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctxRef.current = ctx
    ctx.scale(dpr, dpr)

    // metallic/grey overlay
    const grd = ctx.createLinearGradient(0, 0, width, height)
    grd.addColorStop(0, "rgba(180,180,185,0.95)")
    grd.addColorStop(1, "rgba(120,120,125,0.95)")
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)

    // subtle noise pattern
    ctx.globalAlpha = 0.08
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = Math.random() * 2
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = "black"
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }, [width, height])

  function scratchAt(clientX: number, clientY: number, target: EventTarget | null) {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = "source-over"
  }

  function computeReveal() {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return 0
    const dpr = window.devicePixelRatio || 1
    const img = ctx.getImageData(0, 0, Math.floor(width * dpr), Math.floor(height * dpr))
    let cleared = 0
    for (let i = 3; i < img.data.length; i += 4) {
      if (img.data[i] === 0) cleared++
    }
    const total = Math.floor(width * dpr) * Math.floor(height * dpr)
    return cleared / total
  }

  function endStroke() {
    drawingRef.current = false
    const pct = computeReveal()
    if (!revealed && pct > 0.6) {
      setRevealed(true)
      onRevealComplete?.()
    }
  }

  // Mouse
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    drawingRef.current = true
    scratchAt(e.clientX, e.clientY, e.target)
  }
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    scratchAt(e.clientX, e.clientY, e.target)
  }
  const onMouseUp = () => endStroke()
  const onMouseLeave = () => endStroke()

  // Touch
  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    drawingRef.current = true
    const t = e.touches[0]
    scratchAt(t.clientX, t.clientY, e.target)
  }
  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const t = e.touches[0]
    scratchAt(t.clientX, t.clientY, e.target)
  }
  const onTouchEnd = () => endStroke()

  return (
    <div
      className={cn("relative rounded-xl border border-border/60 bg-card/20 backdrop-blur-md p-4", "shadow-lg")}
      style={{ width, height }}
    >
      {/* Hidden reward (under overlay) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "text-4xl font-bold tracking-wide transition-all duration-300",
            revealed ? "text-foreground" : "text-foreground/80",
          )}
        >
          <span
            className={cn(
              revealed ? "bg-amber-300/30 text-amber-200 ring-2 ring-amber-300/60" : "bg-transparent",
              "px-3 py-1 rounded-lg shadow-[0_0_24px_rgba(255,193,7,0.35)]",
            )}
          >
            {rewardText}
          </span>
        </div>
      </div>

      {/* Scratch overlay */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-xl cursor-[url('/scratch-cursor.jpg'),auto]"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      )}

      {/* Pink hint bar */}
      {!revealed && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-pink-600/80 px-3 py-1 text-xs text-white">
          Scratch to reveal
        </div>
      )}
    </div>
  )
}

export default ScratchCard
