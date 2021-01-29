export interface ReplayProgram {
    run: (replay: boolean) => Promise<void>
}
