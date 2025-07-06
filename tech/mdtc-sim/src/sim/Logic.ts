export class Logic<State> {
    tick: number = 0
    state: State
    private initialState: State

    constructor(initialState: State) {
        this.state = initialState
        this.initialState = initialState
    }

    nextTick() {
        this.tick++
        this.state = this.calculateNextState(this.state)
    }

    reset() {
        this.tick = 0
        this.state = this.initialState
    }

    private calculateNextState(currentState: State): State {
        // TODO: Implement state transition logic
        return currentState
    }
} 