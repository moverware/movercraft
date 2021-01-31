import WebSocket from 'ws'
import { CC } from './CC/CC'
import pokemon from './fun/Pokemon'
import CResponse from './interfaces/CResponse'
import { Label, StateMachine } from './StateMachine'

export class Computer {
    protected cc: CC
    protected id: number
    protected label: Label
    protected closed: boolean

    constructor(protected ws: WebSocket, private machine: StateMachine) {
        this.cc = new CC(ws, '__init__', machine)
        this.closed = false
    }

    public async init() {
        this.ws.on('message', this.killListener)
        this.ws.on('close', () => {
            this.closed = true
            console.log(`Websocket was closed for: ${this.label}`)
        })
        this.ws.send(JSON.stringify({ ready: true }))

        await this.getLabel()
        console.log(`Init computer: ${this.label}`)

        this.cc = new CC(this.ws, this.label, this.machine)

        this.id = await this.cc.os.getComputerID()
    }

    private getLabel = async () => {
        if (this.label) return this.label

        const label = await this.cc.os.getComputerLabel()
        if (label) {
            this.label = label
        } else {
            this.label = pokemon[Math.floor(Math.random() * pokemon.length)]
            await this.cc.os.setComputerLabel(this.label)
        }
    }

    private killListener = async (res: string) => {
        try {
            const cRes: CResponse = JSON.parse(res)
            if (cRes?.kill === true) {
                await this.getLabel()
                console.log(`killing ${this.label}`)
                this.machine.resetLabel(this.label)
            }
        } catch (err) {
            console.log(`Error parsing kill message check for ${this.label}`)
        }
    }
}
