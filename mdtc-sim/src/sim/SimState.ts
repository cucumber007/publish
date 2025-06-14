export type CellState = {
    alive: boolean
}

export interface SimState {
    widthCells: number
    heightCells: number
    cells: CellState[][]
} 