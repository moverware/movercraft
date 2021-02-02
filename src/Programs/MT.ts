import { CC } from '../CC/CC'
import { Pastebin } from './Pastebin'

export class MT extends Pastebin {
    constructor(cc: CC) {
        super(cc)
    }

    protected getCode(): string {
        return '1BKN25c6'
    }

    protected getFilename(): string {
        return 'mt.lua'
    }

    public getName = () => 'mt_local'

    public download = async (): Promise<void> => {
        await this.update()
    }
}
