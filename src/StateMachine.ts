type Step = number
type Res = any

type State = Map<Step, Res>

interface UUIDInfo {
    state: State
    nextStep: number
    replayStep: number
    programName: string
    running: boolean
}

type UUID = string

type Machine = Map<UUID, UUIDInfo>

export class StateMachine {
    private machine: Machine
    constructor() {
        this.machine = new Map<UUID, UUIDInfo>()
    }

    private initState = (uuid: UUID, programName: string) => {
        this.machine.set(uuid, {
            state: new Map<Step, Res>(),
            nextStep: 0,
            replayStep: 0,
            programName,
            running: true,
        })
    }

    private addToState = (info: UUIDInfo, res: Res) => {
        info.state.set(info.nextStep, res)
        info.nextStep++
    }

    public addCmd = (uuid: UUID, result: Res, programName: string) => {
        if (this.machine.has(uuid)) {
            const info: UUIDInfo = this.machine.get(uuid)
            this.addToState(info, result)
        } else {
            this.initState(uuid, programName)
            const info: UUIDInfo = this.machine.get(uuid)
            this.addToState(info, result)
        }
    }

    public resetState = (uuid: UUID) => {
        if (this.machine.has(uuid)) {
            this.machine.delete(uuid)
        }
    }

    public resetStateCount = (uuid: UUID) => {
        if (this.machine.has(uuid)) {
            const info: UUIDInfo = this.machine.get(uuid)
            info.nextStep = 0
            info.replayStep = 0
            info.state = new Map<Step, Res>()
        }
    }

    public getNextReplay = (uuid: UUID): [suc: boolean, res: any] => {
        if (this.machine.has(uuid)) {
            const info = this.machine.get(uuid)
            if (info.replayStep < info.nextStep) {
                const res = info.state.get(info.replayStep)
                info.replayStep++
                return [true, res]
            } else {
                info.replayStep = 0
                return [false, null]
            }
        } else {
            return [false, null]
        }
    }

    public hasReplay = (uuid: UUID): [has: boolean, programName: string] => {
        if (uuid === '__init__') throw new Error('Error: Bad UUID')
        if (this.machine.has(uuid)) {
            const info = this.machine.get(uuid)
            if (info.running) {
                return [true, info.programName]
            }
        } else return [false, null]
    }
}

export { UUID }
