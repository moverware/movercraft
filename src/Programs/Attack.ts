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
        await this.cc.term.write('Attackingz!')
        while (true) {
            // await this.cc.turtle.attack()
            // await this.sleep(500)
            // this.cc.resetReplay()
            for (let j = 0; j < 4; j++) {
                for (let i = 0; i < 10; i++) {
                    await this.cc.turtle.forward()
                }
                await this.cc.turtle.turnRight()
            }
            this.cc.resetPState()
        }
    }
}
