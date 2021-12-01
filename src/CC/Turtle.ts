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

    public getItemDetail = async (): Promise<{
        count: number
        name: string
    } | null> => {
        return this.command.exec<{ count: number; name: string }>(
            'turtle.getItemDetail()'
        )
    }

    public select = async (slot: number): Promise<boolean> => {
        return this.command.exec<boolean>(`turtle.select(${slot})`)
    }

    public placeDown = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.placeDown()')
    }
}
