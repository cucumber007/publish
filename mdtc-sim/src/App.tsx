import { useEffect, useRef, useState } from 'react'
import './App.css'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { styles } from './App.styles'
import { createSim } from './sim/Sim'
import type { SimState, CellState } from './sim/SimState'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawingState, setDrawingState] = useState<SimState>(() => {
    const width = 2
    const height = 2
    const cells: CellState[][] = Array(height).fill(null).map(() => 
      Array(width).fill(null).map(() => ({ alive: false }))
    )
    return { widthCells: width, heightCells: height, cells }
  })
  const [sim] = useState(() => createSim<SimState>(drawingState))

  const handleNextTick = () => {
    sim.nextTick()
    setDrawingState(sim.state)
  }

  const handleReset = () => {
    sim.reset()
    setDrawingState(sim.state)
  }

  const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      const px = x + size * Math.cos(angle)
      const py = y + size * Math.sin(angle)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
  }

  const redraw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const margin = 30
    // Calculate cell size to fill canvas with margin
    const cellSize = Math.min(
      (canvas.width - margin * 2) / drawingState.widthCells,
      (canvas.height - margin * 2) / drawingState.heightCells
    )

    // Center the grid
    const startX = (canvas.width - drawingState.widthCells * cellSize) / 2
    const startY = (canvas.height - drawingState.heightCells * cellSize) / 2

    for (let x = 0; x < drawingState.widthCells; x++) {
      for (let y = 0; y < drawingState.heightCells; y++) {
        const cell = drawingState.cells[y][x]
        ctx.strokeStyle = '#000'
        ctx.strokeRect(
          startX + x * cellSize,
          startY + y * cellSize,
          cellSize,
          cellSize
        )
        if (cell.alive) {
          ctx.fillStyle = '#000'
          ctx.fillRect(
            startX + x * cellSize,
            startY + y * cellSize,
            cellSize,
            cellSize
          )
        }
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      redraw()
    }

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    redraw()
  }, [drawingState])

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <canvas
          ref={canvasRef}
          style={styles.canvas}
        />
        <div style={styles.dock}>
          <button
            onClick={handleNextTick}
            style={{ ...styles.button, ...styles.nextTickButton }}
            onMouseOver={(e) => e.currentTarget.style.background = styles.buttonHover.nextTick}
            onMouseOut={(e) => e.currentTarget.style.background = styles.nextTickButton.background}
          >
            <ArrowForwardIcon />
          </button>
          <button
            onClick={handleReset}
            style={{ ...styles.button, ...styles.resetButton }}
            onMouseOver={(e) => e.currentTarget.style.background = styles.buttonHover.reset}
            onMouseOut={(e) => e.currentTarget.style.background = styles.resetButton.background}
          >
            <RestartAltIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
