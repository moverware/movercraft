import { Command } from './Command'
export interface InspectData {
    state: Record<string, unknown>
    name: string
    tags: Record<string, unknown>
}

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

    public dig = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.dig()')
    }

    public digUp = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.digUp()')
    }

    public digDown = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.digDown()')
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

    public inspectSuccess = async (): Promise<{
        success: boolean
    }> => {
        return this.command.exec<{
            success: boolean
        }>('turtle.inspect()', false, 'part1')
    }

    public inspectData = async (): Promise<InspectData> => {
        return this.command.exec<InspectData>(
            'turtle.inspect()',
            false,
            'part2'
        )
    }

    public inspectUpSuccess = async (): Promise<{
        success: boolean
    }> => {
        return this.command.exec<{
            success: boolean
        }>('turtle.inspectUp()', false, 'part1')
    }

    public inspectUpData = async (): Promise<InspectData> => {
        return this.command.exec<InspectData>(
            'turtle.inspectUp()',
            false,
            'part2'
        )
    }

    public inspectDownSuccess = async (): Promise<{
        success: boolean
    }> => {
        return this.command.exec<{
            success: boolean
        }>('turtle.inspectDown()', false, 'part1')
    }

    public inspectDownData = async (): Promise<InspectData> => {
        return this.command.exec<InspectData>(
            'turtle.inspectDown()',
            false,
            'part2'
        )
    }

    public safeDig = async (blockNames: string[]) => {
        if (await this.inspectSuccess()) {
            const data = await this.inspectData()
            if (data?.name && blockNames.includes(data.name)) {
                await this.dig()
            }
        }
    }

    public safeDigUp = async (blockNames: string[]) => {
        if (await this.inspectUpSuccess()) {
            const data = await this.inspectUpData()
            if (data?.name && blockNames.includes(data.name)) {
                await this.digUp()
            }
        }
    }

    public safeDigDown = async (blockNames: string[]) => {
        if (await this.inspectDownSuccess()) {
            const data = await this.inspectDownData()
            if (data?.name && blockNames.includes(data.name)) {
                await this.digDown()
            }
        }
    }

    public detect = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.detect()')
    }

    public detectUp = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.detectUp()')
    }

    public detectDown = async (): Promise<boolean> => {
        return this.command.exec<boolean>('turtle.detectDown()')
    }
}
