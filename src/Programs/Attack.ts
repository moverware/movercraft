import { CC } from '../CC/CC'
import { Program } from './Program'
import { ReplayProgram } from './ReplayProgram'

export class Attack extends Program implements ReplayProgram {
    constructor(private cc: CC) {
        super()
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    public getName = () => 'attackBeta'

    public run = async (replay: boolean): Promise<void> => {
        this.cc.command.setProgramName(this.getName())
        if (replay) {
            this.cc.command.setReplay()
        }
        await this.cc.term.reset()
        await this.cc.term.write('Attacking!')
        while (true) {
            // this.cc.turtle.attack()
            // await this.sleep(500)

            for (let i = 0; i < 4; i++) {
                for (let ii = 0; ii < 10; ii++) {
                    await this.cc.turtle.forward()
                }
                await this.cc.turtle.turnLeft()
            }

            this.cc.resetPCount()
            if (!this.cc.isConnected()) break
        }
    }
}
