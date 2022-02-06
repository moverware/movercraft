import { CC } from '../CC/CC'
import { Program } from './Program'
import { ReplayProgram } from './ReplayProgram'

const log = 'minecraft:spruce_log'
const leaves = 'minecraft:spruce_leaves'

export class Spruce2x2 extends Program implements ReplayProgram {
    constructor(private cc: CC) {
        super()
    }

    public getName = () => 'Spruce2x2'

    public run = async (replay: boolean): Promise<void> => {
        this.cc.command.setProgramName(this.getName())
        if (replay) {
            this.cc.command.setReplay()
        }
        try {
            await this.cc.term.reset()
            await this.cc.term.write('press any key to start!')
            await this.cc.os.pullEvent('key')
            await this.cc.term.reset()
            await this.cc.term.write('Chop chop fucker!')

            await this.cc.turtle.dig()
            await this.cc.turtle.forward()
            let vert = 0
            while (await this.cc.turtle.detect()) {
                await this.doLevel()
                vert += await this.navigateUp()
            }
            await this.doLevel()
            for (; vert > 0; vert--) {
                await this.cc.turtle.digDown()
                await this.cc.turtle.down()
            }

            await this.cc.term.reset()
            await this.cc.term.write('Done!')

            await this.cc.resetPState()
        } catch (err) {
            await this.cc.term.reset()
            await this.cc.term.write(`Error: ${err.message}`)
            await this.cc.os.pullEvent('key')
            return
        }
    }

    private doLevel = async () => {
        for (let i = 0; i < 4; i++) {
            await this.cc.turtle.safeDig([log, leaves])
            await this.cc.turtle.safeDigUp([log, leaves])
            await this.cc.turtle.safeDigDown([log, leaves])
            await this.cc.turtle.forward()
            await this.cc.turtle.turnLeft()
        }
    }

    private navigateUp = async () => {
        await this.cc.turtle.back()
        let vert = 0
        for (let i = 0; i < 3; i++) {
            await this.cc.turtle.digUp()
            await this.cc.turtle.up()
            vert++
        }
        await this.cc.turtle.dig()
        await this.cc.turtle.forward()
        return vert
    }
}
