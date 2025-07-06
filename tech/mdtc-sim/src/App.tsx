import { useEffect, useRef, useState } from 'react'
import './App.css'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { styles } from './App.styles'
import { createSim } from './sim/Sim'
import type { SimState } from './sim/SimState'
import { INITIAL_STATE } from './sim/SimState'
import { calculateSADAT, calculateTotalResources } from './sim/Formulas'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sim] = useState(() => createSim<SimState>(INITIAL_STATE))

  const handleNextTick = () => {
    sim.nextTick()
    redraw()
  }

  const handleReset = () => {
    sim.reset()
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
      (canvas.width - margin * 2) / sim.state.widthCells,
      (canvas.height - margin * 2) / sim.state.heightCells
    )

    // Center the grid
    const startX = (canvas.width - sim.state.widthCells * cellSize) / 2
    const startY = (canvas.height - sim.state.heightCells * cellSize) / 2

    for (let x = 0; x < sim.state.widthCells; x++) {
      for (let y = 0; y < sim.state.heightCells; y++) {
        const cell = sim.state.cells[y][x]
        ctx.strokeStyle = '#000'
        
        // Draw cell background with blue opacity based on consumption
        const maxConsumption = 100  // Use this to normalize the opacity
        const opacity = Math.min(cell.consumption / maxConsumption, 1) * 0.5  // Scale from 0 to 0.5
        ctx.fillStyle = `rgba(0, 0, 255, ${opacity})`
        ctx.fillRect(
            startX + x * cellSize,
            startY + y * cellSize,
            cellSize,
            cellSize
        )
        
        // Draw cell border
        ctx.strokeRect(
            startX + x * cellSize,
            startY + y * cellSize,
            cellSize,
            cellSize
        )

        // Calculate total resources once
        const totalResources = calculateTotalResources(cell)

        // Draw redistribution amounts on edges
        const pressure = Math.max(0, cell.consumption - totalResources)
        const amountToRedistribute = Math.round(pressure * 0.1)
        
        // Debug logging
        console.log(`Cell [${x},${y}]:`, {
            consumption: cell.consumption,
            totalResources,
            pressure,
            amountToRedistribute
        })

        if (amountToRedistribute > 0) {
            const neighbors = [
                { x: x - 1, y, dx: -1, dy: 0, pos: 'left' },
                { x: x + 1, y, dx: 1, dy: 0, pos: 'right' },
                { x, y: y - 1, dx: 0, dy: -1, pos: 'top' },
                { x, y: y + 1, dx: 0, dy: 1, pos: 'bottom' }
            ]

            // Filter valid neighbors
            const validNeighbors = neighbors.filter(n => 
                n.x >= 0 && n.x < sim.state.widthCells && 
                n.y >= 0 && n.y < sim.state.heightCells
            )

            // Debug logging
            console.log(`Valid neighbors for [${x},${y}]:`, validNeighbors)

            if (validNeighbors.length > 0) {
                const amountPerNeighbor = Math.round(amountToRedistribute / validNeighbors.length)
                
                // Debug logging
                console.log(`Amount per neighbor:`, amountPerNeighbor)
                
                // Draw redistribution amounts
                ctx.font = 'bold 12px Arial'
                ctx.fillStyle = '#000'
                for (const neighbor of validNeighbors) {
                    const neighborCell = sim.state.cells[neighbor.y][neighbor.x]
                    const neighborTotalResources = calculateTotalResources(neighborCell)
                    
                    // Debug logging
                    console.log(`Neighbor [${neighbor.x},${neighbor.y}]:`, {
                        totalResources: neighborTotalResources,
                        canAccept: neighborTotalResources > amountPerNeighbor
                    })
                    
                    // Only show if neighbor can accept the amount
                    if (neighborTotalResources > amountPerNeighbor) {
                        // Draw redistribution arrow
                        const text = `→${amountPerNeighbor}`
                        const metrics = ctx.measureText(text)
                        
                        // Position text near the edge
                        let textX = startX + x * cellSize
                        let textY = startY + y * cellSize
                        
                        // Draw arrow line
                        ctx.beginPath()
                        ctx.strokeStyle = '#666'
                        ctx.lineWidth = 1
                        
                        switch (neighbor.pos) {
                            case 'left':
                                textX += 5
                                textY += cellSize / 2 + metrics.actualBoundingBoxAscent / 2
                                // Draw arrow line
                                ctx.moveTo(textX + metrics.width + 5, textY)
                                ctx.lineTo(startX + neighbor.x * cellSize + cellSize - 5, textY)
                                break
                            case 'right':
                                textX += cellSize - metrics.width - 5
                                textY += cellSize / 2 + metrics.actualBoundingBoxAscent / 2
                                // Draw arrow line
                                ctx.moveTo(textX - 5, textY)
                                ctx.lineTo(startX + neighbor.x * cellSize + 5, textY)
                                break
                            case 'top':
                                textX += cellSize / 2 - metrics.width / 2
                                textY += 15
                                // Draw arrow line
                                ctx.moveTo(textX + metrics.width / 2, textY + metrics.actualBoundingBoxAscent + 5)
                                ctx.lineTo(textX + metrics.width / 2, startY + neighbor.y * cellSize + cellSize - 5)
                                break
                            case 'bottom':
                                textX += cellSize / 2 - metrics.width / 2
                                textY += cellSize - 5
                                // Draw arrow line
                                ctx.moveTo(textX + metrics.width / 2, textY - metrics.actualBoundingBoxAscent - 5)
                                ctx.lineTo(textX + metrics.width / 2, startY + neighbor.y * cellSize + 5)
                                break
                        }
                        ctx.stroke()
                        
                        // Draw white background with larger padding
                        ctx.fillStyle = 'white'
                        ctx.fillRect(
                            textX - 4,
                            textY - metrics.actualBoundingBoxAscent - 4,
                            metrics.width + 8,
                            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 8
                        )
                        
                        // Draw black border
                        ctx.strokeStyle = 'black'
                        ctx.strokeRect(
                            textX - 4,
                            textY - metrics.actualBoundingBoxAscent - 4,
                            metrics.width + 8,
                            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 8
                        )
                        
                        // Draw text
                        ctx.fillStyle = '#000'
                        ctx.fillText(text, textX, textY)

                        // Draw moved consumption on neighbor's side
                        const movedText = `+${amountPerNeighbor}`
                        const movedMetrics = ctx.measureText(movedText)
                        
                        // Position moved text on neighbor's side
                        let movedX = startX + neighbor.x * cellSize
                        let movedY = startY + neighbor.y * cellSize
                        
                        switch (neighbor.pos) {
                            case 'left':
                                movedX += cellSize - movedMetrics.width - 5
                                movedY += cellSize / 2 + movedMetrics.actualBoundingBoxAscent / 2
                                break
                            case 'right':
                                movedX += 5
                                movedY += cellSize / 2 + movedMetrics.actualBoundingBoxAscent / 2
                                break
                            case 'top':
                                movedX += cellSize / 2 - movedMetrics.width / 2
                                movedY += cellSize - 5
                                break
                            case 'bottom':
                                movedX += cellSize / 2 - movedMetrics.width / 2
                                movedY += 15
                                break
                        }
                        
                        // Draw white background with larger padding
                        ctx.fillStyle = 'white'
                        ctx.fillRect(
                            movedX - 4,
                            movedY - movedMetrics.actualBoundingBoxAscent - 4,
                            movedMetrics.width + 8,
                            movedMetrics.actualBoundingBoxAscent + movedMetrics.actualBoundingBoxDescent + 8
                        )
                        
                        // Draw black border
                        ctx.strokeStyle = 'black'
                        ctx.strokeRect(
                            movedX - 4,
                            movedY - movedMetrics.actualBoundingBoxAscent - 4,
                            movedMetrics.width + 8,
                            movedMetrics.actualBoundingBoxAscent + movedMetrics.actualBoundingBoxDescent + 8
                        )
                        
                        // Draw text
                        ctx.fillStyle = '#000'
                        ctx.fillText(movedText, movedX, movedY)
                    }
                }
            }
        }

        // Draw resource amounts
        ctx.font = '12px Arial'
        const padding = 8
        const rightPadding = 12
        const lineHeight = 24
        const textPadding = 8
        const verticalPadding = 6
        const resourceStartY = startY + y * cellSize + padding + lineHeight + 4

        // Helper function to draw text with background
        const drawTextWithBackground = (text: string, x: number, y: number, color: string, align: 'left' | 'right' = 'left') => {
          const metrics = ctx.measureText(text)
          const textX = align === 'right' ? x - metrics.width : x
          
          // Draw white background
          ctx.fillStyle = 'white'
          ctx.fillRect(
            textX - textPadding,
            y - metrics.actualBoundingBoxAscent - verticalPadding,
            metrics.width + textPadding * 2,
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + verticalPadding * 2
          )
          // Draw black border
          ctx.strokeStyle = 'black'
          ctx.strokeRect(
            textX - textPadding,
            y - metrics.actualBoundingBoxAscent - verticalPadding,
            metrics.width + textPadding * 2,
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + verticalPadding * 2
          )
          // Draw text
          ctx.fillStyle = color
          ctx.fillText(text, textX, y)
        }

        // Draw consumption in top left
        const consumptionText = `Consumption: ${cell.consumption}`
        drawTextWithBackground(
          consumptionText,
          startX + x * cellSize + padding,
          startY + y * cellSize + padding + lineHeight,
          '#666'
        )

        // Draw limited resources
        sim.state.limitedResources.forEach((resourceName, i) => {
          const amount = cell.limitedResources[resourceName]
          const text = `${resourceName}: ${amount}`
          drawTextWithBackground(
            text,
            startX + x * cellSize + cellSize - rightPadding,
            resourceStartY + (i * lineHeight),
            '#000',
            'right'
          )
        })

        // Draw unlimited resources
        sim.state.unlimitedResources.forEach((resourceName, i) => {
          const amount = cell.unlimitedResources[resourceName]
          const text = `${resourceName}: ${amount}`
          drawTextWithBackground(
            text,
            startX + x * cellSize + cellSize - rightPadding,
            resourceStartY + ((i + sim.state.limitedResources.length) * lineHeight),
            '#666',
            'right'
          )
        })

        // Draw SADAT in bottom left
        const sadat = calculateSADAT(totalResources, cell.consumption)
        const sadatText = `SADAT: ${sadat.toFixed(2)}`
        drawTextWithBackground(
          sadatText,
          startX + x * cellSize + padding,
          startY + y * cellSize + cellSize - padding - 5 - lineHeight * 2,
          '#666'
        )

        // Draw expansion pressure in bottom left
        const expansionPressure = Math.max(0, cell.consumption - totalResources)
        const pressureText = `Pressure: ${expansionPressure.toFixed(2)}`
        drawTextWithBackground(
          pressureText,
          startX + x * cellSize + padding,
          startY + y * cellSize + cellSize - padding - 5,
          '#666'
        )

        // Draw unmoved pressure
        const unmovedText = `Unmoved: ${cell.unmovedPressure.toFixed(2)}`
        drawTextWithBackground(
          unmovedText,
          startX + x * cellSize + padding,
          startY + y * cellSize + cellSize - padding - 5 - lineHeight,
          '#666'
        )
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
  }, [sim.state])

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
