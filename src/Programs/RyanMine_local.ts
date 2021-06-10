import { CC } from '../CC/CC'
import { Pastebin } from './Pastebin'

export class RyanMine extends Pastebin {
    constructor(cc: CC) {
        super(cc)
    }

    protected getCode(): string {
        return 'XagbiPTY'
    }

    protected getFilename(): string {
        return 'ryanmine.lua'
    }

    public getName = () => 'RyanMine_local'

    public run = async (): Promise<void> => {
        await this.update()
        return this.cc.command.exec<void>(`dofile("${this.getPath()}")()`)
    }
}
