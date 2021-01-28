import { CC } from '../CC/CC'
import { Pastebin } from './Pastebin'

export class TorchMine extends Pastebin {
    constructor(cc: CC) {
        super(cc)
    }

    protected getCode(): string {
        return 'KX8jxjf4'
    }

    protected getFilename(): string {
        return 'torchMine.lua'
    }

    public run = async (): Promise<void> => {
        console.log('updating!')
        await this.update()
        console.log('done!')
        return this.cc.exec<void>(`loadfile("${this.getPath()}")`)
    }
}
