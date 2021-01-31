import WebSocket from 'ws'
import { OS } from './OS'
import { Turtle } from './Turtle'
import { Term } from './Term'
import { Command } from './Command'
import { Shell } from './Shell'
import { FS } from './FS'
import { HTTP } from './HTTP'
import { UUID, StateMachine } from '../StateMachine'

export class CC {
    public command: Command
    public turtle: Turtle
    public os: OS
    public term: Term
    public read: () => Promise<string>
    public shell: Shell
    public fs: FS
    public http: HTTP

    constructor(
        private ws: WebSocket,
        private uuid: UUID,
        private machine: StateMachine
    ) {
        this.command = new Command(ws, machine, uuid)
        this.turtle = new Turtle(this.command)
        this.os = new OS(this.command)
        this.term = new Term(this.command)
        this.shell = new Shell(this.command)
        this.fs = new FS(this.command)
        this.http = new HTTP(this.command)

        this.read = async (): Promise<string> => {
            let val = await this.command.exec<string>('read()')
            if (val === undefined || val == null) val = ''
            return val
        }
    }

    // To reset replay state and not resume on reconnect
    public resetPState = () => {
        this.machine.resetState(this.uuid)
    }

    // To reset replay state but resume on reconnect
    public resetPCount = () => {
        this.machine.resetStateCount(this.uuid)
    }

    public hasReplay = (): [has: boolean, programName: string] => {
        return this.machine.hasReplay(this.uuid)
    }

    public isConnected = () => {
        return this.ws.readyState === this.ws.OPEN
    }
}
