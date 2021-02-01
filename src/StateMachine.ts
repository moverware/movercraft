import { Firestore } from '@google-cloud/firestore'

type Step = number
type Res = any

type State = Res[]

interface ComputerState {
    state: State
    nextStep: number
    replayStep: number
    programName: string
    running: boolean
}

type UUID = string

export class StateMachine {
    private db: Firestore
    private collection: FirebaseFirestore.CollectionReference

    constructor() {
        this.db = new Firestore({ projectId: 'movercraft' })
        this.collection = this.db.collection('computers')
    }

    private initRunning = async (uuid: UUID, programName: string) => {
        const doc = this.collection.doc(uuid)
        await doc.set({
            state: [],
            nextStep: 0,
            replayStep: 0,
            programName,
            running: true,
        })

        return doc.get()
    }

    private initNotRunning = async (uuid: UUID) => {
        const doc = this.collection.doc(uuid)
        await doc.set({
            state: [],
            nextStep: 0,
            replayStep: 0,
            programName: null,
            running: false,
        })

        return doc.get()
    }

    private addToState = async (uuid: UUID, res: Res, programName: string) => {
        const docRef = this.collection.doc(uuid)
        let doc = await docRef.get()
        if (!doc.exists) {
            doc = await this.initRunning(uuid, programName)
        }

        let cState: ComputerState = doc.data() as ComputerState

        if (!cState.running) {
            doc = await this.initRunning(uuid, programName)
            cState = doc.data() as ComputerState
        }

        cState.state[cState.nextStep] = res
        cState.nextStep++
        doc.ref.set(cState)
    }

    public addCmd = (uuid: UUID, result: Res, programName: string) => {
        this.addToState(uuid, result, programName)
    }

    public resetState = async (uuid: UUID) => {
        await this.initNotRunning(uuid)
    }

    public resetStateCount = async (uuid: UUID) => {
        const docRef = this.collection.doc(uuid)
        const doc = await docRef.get()
        if (doc.exists) {
            const cState = doc.data() as ComputerState
            cState.nextStep = 0
            cState.replayStep = 0
            cState.state = []
            doc.ref.set(cState)
        }
    }

    public getNextReplay = async (
        uuid: UUID
    ): Promise<[suc: boolean, res: any]> => {
        const docRef = this.collection.doc(uuid)
        const doc = await docRef.get()
        if (doc.exists) {
            const cState = doc.data() as ComputerState
            if (cState.replayStep < cState.nextStep) {
                const res = cState.state[cState.replayStep]
                cState.replayStep++
                doc.ref.set(cState)
                return [true, res]
            } else {
                cState.replayStep = 0
                doc.ref.set(cState)
                return [false, null]
            }
        } else {
            return [false, null]
        }
    }

    public hasReplay = async (
        uuid: UUID
    ): Promise<[has: boolean, programName: string]> => {
        if (uuid === '__init__') throw new Error('Error: Bad UUID')
        const docRef = this.collection.doc(uuid)
        const doc = await docRef.get()

        if (doc.exists) {
            const cState = doc.data() as ComputerState
            if (cState.running) {
                return [true, cState.programName]
            }
            return [false, null]
        } else return [false, null]
    }
}

export { UUID }
