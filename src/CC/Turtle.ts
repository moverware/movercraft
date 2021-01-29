import WebSocket from 'ws'
import { Label, StateMachine } from '../StateMachine'

import { Command } from './Command'

export class Turtle {
    constructor(private command: Command) {}

    public forward = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.forward()')
    }

    public back = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.back()')
    }

    public up = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.up()')
    }

    public down = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.down()')
    }

    public turnLeft = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.turnLeft()')
    }

    public turnRight = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.turnRight()')
    }

    public getSelectedSlot = async (): Promise<number> => {
        return this.command.exec<number>('turtle.getSelectedSlot()')
    }

    public getFuelLimit = async (): Promise<number> => {
        return this.command.exec<number>('turtle.getFuelLimit()')
    }

    public getFuelLevel = async (): Promise<number> => {
        return this.command.exec<number>('turtle.getFuelLevel()')
    }

    public attack = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.attack()')
    }
}
