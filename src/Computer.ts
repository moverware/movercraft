import WebSocket from 'ws'
import { CC } from './CC/CC'
import pokemon from './fun/Pokemon'

export class Computer {
    protected cc: CC
    protected id: number
    protected label: string

    constructor(ws: WebSocket) {
        this.cc = new CC(ws)
    }

    public async init() {
        const label = await this.cc.os.getComputerLabel()
        if (label) {
            this.label = label
        } else {
            this.label = pokemon[Math.floor(Math.random() * pokemon.length)]
            await this.cc.os.setComputerLabel(this.label)
        }

        this.id = await this.cc.os.getComputerID()
    }
}
