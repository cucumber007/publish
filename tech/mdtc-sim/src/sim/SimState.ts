export type Resource = {
    name: string
}

export type Technology = {
    name: string
    resource: Resource
}

export type TechnologyTree = {
    technologies: Technology[]
}

export type CellState = {
    limitedResources: Record<string, number>
    unlimitedResources: Record<string, number>
    consumption: number
    unmovedPressure: number
}

export interface SimState {
    widthCells: number
    heightCells: number
    cells: CellState[][]
    technologyTree: TechnologyTree
    limitedResources: string[]
    unlimitedResources: string[]
}

export const INITIAL_STATE: SimState = {
    widthCells: 2,
    heightCells: 2,
    cells: Array(2).fill(null).map((_, y) => 
        Array(2).fill(null).map((_, x) => {
            // Top right cell has most sunlight
            if (x === 1 && y === 0) {
                return {
                    limitedResources: { "Coal": 0 },
                    unlimitedResources: { "Sunlight": 100 },
                    consumption: 1,
                    unmovedPressure: 0
                }
            }
            // Bottom left has medium sunlight
            if (x === 0 && y === 1) {
                return {
                    limitedResources: { "Coal": 0 },
                    unlimitedResources: { "Sunlight": 50 },
                    consumption: 0,
                    unmovedPressure: 0
                }
            }
            // Bottom right has some sunlight
            if (x === 1 && y === 1) {
                return {
                    limitedResources: { "Coal": 0 },
                    unlimitedResources: { "Sunlight": 20 },
                    consumption: 0,
                    unmovedPressure: 0
                }
            }
            // Top left has high sunlight
            return {
                limitedResources: { "Coal": 0 },
                unlimitedResources: { "Sunlight": 80 },
                consumption: 0,
                unmovedPressure: 0
            }
        })
    ),
    technologyTree: {
        technologies: [
            {
                name: "Mining",
                resource: { name: "Coal" }
            },
            {
                name: "Farming",
                resource: { name: "Sunlight" }
            }
        ]
    },
    limitedResources: ["Coal"],
    unlimitedResources: ["Sunlight"]
}

// Set initial sunlight values
INITIAL_STATE.cells[0][1].unlimitedResources.sunlight = 100  // Top right
INITIAL_STATE.cells[0][1].consumption = 1  // Start with consumption 1
INITIAL_STATE.cells[0][0].unlimitedResources.sunlight = 80   // Top left
INITIAL_STATE.cells[1][0].unlimitedResources.sunlight = 50   // Bottom left
INITIAL_STATE.cells[1][1].unlimitedResources.sunlight = 20   // Bottom right