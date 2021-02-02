import { CC } from '../CC/CC'
import { Pastebin } from './Pastebin'

export class Wheat extends Pastebin {
    constructor(cc: CC) {
        super(cc)
    }

    protected getCode(): string {
        return 'JVdYcAdE'
    }

    protected getFilename(): string {
        return 'wheat.lua'
    }

    public getName = () => 'wheat_local'

    public run = async (): Promise<void> => {
        await this.update()
        return this.cc.command.exec<void>(`dofile("${this.getPath()}")()`)
    }
}
