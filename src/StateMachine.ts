type Step = number
type Res = any

type State = Map<Step, Res>

interface LabelInfo {
    state: State
    nextStep: number
    replayStep: number
    programName: string
}

type Label = string

type Machine = Map<Label, LabelInfo>

export class StateMachine {
    private machine: Machine
    constructor() {
        this.machine = new Map<Label, LabelInfo>()
    }

    private initLabel = (label: Label, programName: string) => {
        this.machine.set(label, {
            state: new Map<Step, Res>(),
            nextStep: 0,
            replayStep: 0,
            programName,
        })
    }

    private addToState = (info: LabelInfo, res: Res) => {
        info.state.set(info.nextStep, res)
        info.nextStep++
    }

    public addCmd = (label: Label, result: Res, programName: string) => {
        if (this.machine.has(label)) {
            const info: LabelInfo = this.machine.get(label)
            this.addToState(info, result)
        } else {
            this.initLabel(label, programName)
            const info: LabelInfo = this.machine.get(label)
            this.addToState(info, result)
        }
    }

    public resetLabel = (label: Label) => {
        if (this.machine.has(label)) {
            this.machine.delete(label)
        }
    }

    public getNextReplay = (label: Label): [suc: boolean, res: any] => {
        if (this.machine.has(label)) {
            const info = this.machine.get(label)
            if (info.replayStep < info.nextStep) {
                const res = info.state.get(info.replayStep)
                info.replayStep++
                return [true, res]
            } else {
                this.resetLabel(label)
                return [false, null]
            }
        } else
            throw new Error(`Error: label ${label} not found in state machine`)
    }

    public hasReplay = (label: Label): [has: boolean, programName: string] => {
        if (this.machine.has(label)) {
            const info = this.machine.get(label)
            if (info.nextStep > 0) {
                return [true, info.programName]
            }
        } else return [false, null]
    }
}

export { Label }
