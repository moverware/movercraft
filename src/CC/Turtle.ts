import WebSocket from 'ws'

import { Command } from './Command'

export class Turtle extends Command {
    constructor(ws: WebSocket) {
        super(ws)
    }

    public forward = async (): Promise<boolean> => {
        return this.exec<boolean>('turtle.forward()')
    }

    public back = async (): Promise<boolean> => {
        return this.exec<boolean>('turtle.back()')
    }

    public up = async (): Promise<boolean> => {
        return this.exec<boolean>('turtle.up()')
    }

    public down = async (): Promise<boolean> => {
        return this.exec<boolean>('turtle.down()')
    }

    public turnLeft = async (): Promise<boolean> => {
        return this.exec<boolean>('turtle.turnLeft()')
    }

    public turnRight = async (): Promise<boolean> => {
        return this.exec<boolean>('turtle.turnRight()')
    }

    public getSelectedSlot = async (): Promise<number> => {
        return this.exec<number>('turtle.getSelectedSlot()')
    }

    public getFuelLimit = async (): Promise<number> => {
        return this.exec<number>('turtle.getFuelLimit()')
    }

    public getFuelLevel = async (): Promise<number> => {
        return this.exec<number>('turtle.getFuelLevel()')
    }
}
