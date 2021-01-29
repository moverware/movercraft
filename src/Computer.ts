import WebSocket from 'ws'
import { CC } from './CC/CC'
import pokemon from './fun/Pokemon'
import { Label, StateMachine } from './StateMachine'

export class Computer {
    protected cc: CC
    protected id: number
    protected label: Label

    constructor(protected ws: WebSocket, private machine: StateMachine) {
        this.cc = new CC(ws, '__init__', machine)
    }

    public async init() {
        this.ws.on('close', () => {
            console.log(`Websocket was closed for: ${this.label}`)
        })
        const label = await this.cc.os.getComputerLabel()
        if (label) {
            this.label = label
        } else {
            this.label = pokemon[Math.floor(Math.random() * pokemon.length)]
            await this.cc.os.setComputerLabel(this.label)
        }

        this.cc = new CC(this.ws, this.label, this.machine)

        this.id = await this.cc.os.getComputerID()
    }
}
