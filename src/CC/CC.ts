import WebSocket from 'ws'
import { OS } from './OS'
import { Turtle } from './Turtle'
import { Term } from './Term'
import { Command } from './Command'
import { Shell } from './Shell'
import { FS } from './FS'
import { HTTP } from './http'

export class CC extends Command {
    public turtle: Turtle
    public os: OS
    public term: Term
    public read: () => Promise<string>
    public shell: Shell
    public fs: FS
    public http: HTTP

    constructor(ws: WebSocket) {
        super(ws)
        this.turtle = new Turtle(ws)
        this.os = new OS(ws)
        this.term = new Term(ws)
        this.shell = new Shell(ws)
        this.fs = new FS(ws)
        this.http = new HTTP(ws)

        this.read = async (): Promise<string> => {
            let val = await this.exec<string>('read()')
            if (val === undefined || val == null) val = ''
            return val
        }
    }
}
