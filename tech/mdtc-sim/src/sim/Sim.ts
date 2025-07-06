import { Logic } from './Logic'
import type { SimState } from './SimState'
import {
    calculateTotalResources,
    calculateGrowthFactor,
    calculateNewConsumption,
    calculatePressure,
    calculateAmountToRedistribute,
    calculateUnmovedPressure,
    calculateFinalConsumption
} from './Formulas'

export type Sim<State> = Logic<State>

export function createSim(initialState: SimState) {
    let state = { ...initialState }
    let tickCount = 0

    const nextTick = () => {
        tickCount++
        // Create a completely new state object
        const newState = {
            ...state,
            cells: state.cells.map(row => 
                row.map(cell => ({ ...cell }))
            )
        }

        console.log(`\nTick ${tickCount}:`)
        // Update each cell's consumption
        for (let y = 0; y < newState.cells.length; y++) {
            for (let x = 0; x < newState.cells[y].length; x++) {
                const cell = newState.cells[y][x]
                const currentConsumption = cell.consumption
                
                // Calculate total resources
                const totalResources = calculateTotalResources(cell)
                
                // Calculate growth and new consumption
                const growthFactor = calculateGrowthFactor(currentConsumption, totalResources)
                let newConsumption = calculateNewConsumption(currentConsumption, growthFactor)
                
                // Calculate pressure and redistribution
                const pressure = calculatePressure(newConsumption, totalResources)
                const amountToRedistribute = calculateAmountToRedistribute(pressure)
                let unmovedPressure = amountToRedistribute  // Track pressure that couldn't be moved
                
                // Redistribute pressure to neighboring cells
                if (amountToRedistribute > 0) {
                    const neighbors = [
                        { x: x - 1, y },
                        { x: x + 1, y },
                        { x, y: y - 1 },
                        { x, y: y + 1 }
                    ]

                    // Filter valid neighbors
                    const validNeighbors = neighbors.filter(n => 
                        n.x >= 0 && n.x < newState.cells[0].length && 
                        n.y >= 0 && n.y < newState.cells.length
                    )

                    if (validNeighbors.length > 0) {
                        const amountPerNeighbor = Math.round(amountToRedistribute / validNeighbors.length)
                        
                        // Distribute to each neighbor, respecting their growth capacity
                        for (const neighbor of validNeighbors) {
                            const neighborCell = newState.cells[neighbor.y][neighbor.x]
                            const neighborTotalResources = calculateTotalResources(neighborCell)
                            
                            // Only move pressure if neighbor has enough growth capacity
                            if (neighborTotalResources > amountPerNeighbor) {
                                neighborCell.consumption = Math.round(neighborCell.consumption + amountPerNeighbor)
                                unmovedPressure -= amountPerNeighbor
                            }
                        }
                    }
                }
                
                // Update final consumption and unmoved pressure
                cell.consumption = calculateFinalConsumption(newConsumption, amountToRedistribute, unmovedPressure)
                cell.unmovedPressure = calculateUnmovedPressure(unmovedPressure)

                console.log(`Cell [${x},${y}]: Consumption ${currentConsumption} -> ${cell.consumption} (max: ${totalResources})`)
            }
        }

        state = newState
    }

    const reset = () => {
        state = { ...initialState }
        tickCount = 0
    }

    return {
        get state() {
            return state
        },
        nextTick,
        reset
    }
}