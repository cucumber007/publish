import type { CellState } from './SimState'

export function calculateTotalResources(cell: CellState): number {
    return Object.values(cell.limitedResources).reduce((sum, amount) => sum + amount, 0) +
           Object.values(cell.unlimitedResources).reduce((sum, amount) => sum + amount, 0)
}

export function calculateGrowthFactor(currentConsumption: number, totalResources: number): number {
    const deficit = Math.max(0, currentConsumption - totalResources)
    return deficit > 0 ? Math.max(0, 1 - (deficit / totalResources)) : 1
}

export function calculateNewConsumption(currentConsumption: number, growthFactor: number): number {
    return Math.round(currentConsumption * (1 + growthFactor))
}

export function calculatePressure(newConsumption: number, totalResources: number): number {
    return Math.max(0, newConsumption - totalResources)
}

export function calculateAmountToRedistribute(pressure: number): number {
    return Math.round(pressure * 0.1) 
}

export function calculateUnmovedPressure(amountToRedistribute: number): number {
    return Math.round(amountToRedistribute * 0.1) 
}

export function calculateFinalConsumption(newConsumption: number, amountToRedistribute: number, unmovedPressure: number): number {
    return Math.max(0, Math.round(newConsumption - amountToRedistribute + unmovedPressure))
}

export function calculateSADAT(totalResources: number, consumption: number): number {
    return totalResources - consumption
} 