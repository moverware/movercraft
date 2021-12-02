import { CC } from '../CC/CC'
import { Program } from './Program'
import { ReplayProgram } from './ReplayProgram'

type SelectableBlocks = 'wood' | 'glass' | 'dirt' | 'log'
type Blocks = SelectableBlocks | 'air'
type Layer = Blocks[][]

const blockMap = new Map<SelectableBlocks, string>([
    ['wood', 'minecraft:oak_planks'],
    ['glass', 'minecraft:glass'],
    ['dirt', 'minecraft:dirt'],
    ['log', 'minecraft:oak_log'],
])

export class BusyBee extends Program implements ReplayProgram {
    constructor(private cc: CC) {
        super()
    }

    public getName = () => 'BusyBee'

    public run = async (replay: boolean): Promise<void> => {
        this.cc.command.setProgramName(this.getName())
        if (replay) {
            this.cc.command.setReplay()
        }
        try {
            await this.cc.term.reset()
            await this.cc.term.write('press any key to start!')
            await this.cc.os.pullEvent('key')

            const layers: Layer[] = [
                this.layer1,
                this.layer23,
                this.layer23,
                this.layer4,
                this.layer5,
            ]
            for (const layer of layers) {
                await this.cc.turtle.up()
                await this.doLayer(layer)
            }
        } catch (err) {
            await this.cc.term.reset()
            await this.cc.term.write(`Error: ${err.message}`)
            await this.cc.os.pullEvent('key')
            return
        }
    }

    private selectBlock = async (block: SelectableBlocks): Promise<void> => {
        let slot = 1
        await this.cc.turtle.select(slot)
        let selected = await this.cc.turtle.getItemDetail()
        while (!selected || selected?.name !== blockMap.get(block)) {
            slot++
            await this.cc.turtle.select(slot)
            selected = await this.cc.turtle.getItemDetail()

            if (slot >= 16) {
                throw new Error(`Out of ${block}`)
            }
        }
    }

    private layer1: Layer = [
        ['log', 'wood', 'wood', 'wood', 'wood', 'wood', 'log'],
        ['wood', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'wood'],
        ['wood', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'wood'],
        ['wood', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'wood'],
        ['wood', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'wood'],
        ['wood', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'wood'],
        ['log', 'wood', 'wood', 'wood', 'wood', 'wood', 'log'],
    ]

    private layer23: Layer = [
        ['log', 'glass', 'glass', 'glass', 'glass', 'glass', 'log'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['log', 'glass', 'glass', 'air', 'glass', 'glass', 'log'],
    ]

    private layer4: Layer = [
        ['log', 'glass', 'glass', 'glass', 'glass', 'glass', 'log'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['glass', 'air', 'air', 'air', 'air', 'air', 'glass'],
        ['log', 'glass', 'glass', 'glass', 'glass', 'glass', 'log'],
    ]

    private layer5: Layer = [
        ['air', 'air', 'air', 'air', 'air', 'air', 'air'],
        ['air', 'glass', 'glass', 'glass', 'glass', 'glass', 'air'],
        ['air', 'glass', 'glass', 'glass', 'glass', 'glass', 'air'],
        ['air', 'glass', 'glass', 'glass', 'glass', 'glass', 'air'],
        ['air', 'glass', 'glass', 'glass', 'glass', 'glass', 'air'],
        ['air', 'glass', 'glass', 'glass', 'glass', 'glass', 'air'],
        ['air', 'air', 'air', 'air', 'air', 'air', 'air'],
    ]

    private transformLayer = (layer: Layer): Layer => {
        const mutLayer = [...layer]
        const result: Layer = []
        const refRow = mutLayer[0]
        for (let i = refRow.length - 1; i >= 0; i--) {
            const transformedRow = mutLayer.reverse().map((row) => row[i])
            result.push(transformedRow)
        }

        return result
    }

    private doLayer = async (layer: Layer): Promise<void> => {
        let nextTurnLeft = true
        let vertStart = 0
        let horizStart = 0
        layer = this.transformLayer(layer)
        for (let i = 0; i < layer.length; i++) {
            const row = layer[i]
            for (let j = 0; j < row.length; j++) {
                const block = row[j]
                if (block === 'air') {
                    if (j < row.length - 1) {
                        await this.cc.turtle.forward()
                        if (nextTurnLeft) {
                            vertStart++
                        } else {
                            vertStart--
                        }
                    }
                    continue
                }
                await this.selectBlock(block)
                await this.cc.turtle.placeDown()

                if (j < row.length - 1) {
                    await this.cc.turtle.forward()
                    if (nextTurnLeft) {
                        vertStart++
                    } else {
                        vertStart--
                    }
                }
            }

            if (i < layer.length - 1) {
                if (nextTurnLeft) {
                    await this.cc.turtle.turnLeft()
                    await this.cc.turtle.forward()
                    horizStart++
                    await this.cc.turtle.turnLeft()
                    nextTurnLeft = false
                } else {
                    await this.cc.turtle.turnRight()
                    await this.cc.turtle.forward()
                    horizStart++
                    await this.cc.turtle.turnRight()
                    nextTurnLeft = true
                }
            }
        }

        await this.returnToStart(vertStart, horizStart)
    }

    private returnToStart = async (
        vertStart: number,
        horizStart: number
    ): Promise<void> => {
        if (vertStart > 0) {
            await this.cc.turtle.turnLeft()
            await this.cc.turtle.turnLeft()
        }
        while (vertStart > 0) {
            await this.cc.turtle.forward()
            vertStart--
        }

        await this.cc.turtle.turnLeft()
        while (horizStart > 0) {
            await this.cc.turtle.forward()
            horizStart--
        }
        await this.cc.turtle.turnLeft()
    }
}
