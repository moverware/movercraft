import { CC } from '../CC/CC'
import { Pastebin } from './Pastebin'

export class AttackPB extends Pastebin {
    constructor(cc: CC) {
        super(cc)
    }

    protected getCode(): string {
        return '7mLck1sB'
    }

    protected getFilename(): string {
        return 'attack.lua'
    }

    public getName = (): string => 'attack_local'

    public run = async (): Promise<void> => {
        await this.update()
        return this.cc.command.exec<void>(`dofile("${this.getPath()}")()`)
    }
}
