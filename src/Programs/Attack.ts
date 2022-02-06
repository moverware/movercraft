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

    public getName = () => 'attack_1.0'

    public run = async (replay: boolean): Promise<void> => {
        this.cc.command.setProgramName(this.getName())
        if (replay) {
            this.cc.command.setReplay()
        }
        await this.cc.term.reset()
        await this.cc.term.write('Attacking!')
        while (true) {
            this.cc.turtle.attack()
            await this.sleep(500)

            await this.cc.resetPCount()
            if (!this.cc.isConnected()) break
        }
    }
}
