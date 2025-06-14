import { Logic } from './Logic'

export type Sim<State> = Logic<State>

export const createSim = <State>(initialState: State): Sim<State> => {
    return new Logic(initialState)
}