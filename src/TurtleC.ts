import WebSocket from 'ws'
import { Computer } from './Computer'

export class TurtleC extends Computer {
    private fuelLevel: number
    private fuelLimit: number
    private selectedSlot: number

    constructor(ws: WebSocket) {
        super(ws)
    }

    public init = async () => {
        await super.init()
        this.fuelLevel = await this.cc.turtle.getFuelLevel()
        this.fuelLimit = await this.cc.turtle.getFuelLimit()
        this.selectedSlot = await this.cc.turtle.getSelectedSlot()
    }
}
