import { CC } from '../CC/CC'
import { MT } from './MT'
import { Pastebin } from './Pastebin'

export class TorchMine extends Pastebin {
    private mt: MT
    constructor(cc: CC) {
        super(cc)
        this.mt = new MT(cc)
    }

    protected getCode(): string {
        return 'KX8jxjf4'
    }

    protected getFilename(): string {
        return 'torchMine.lua'
    }

    public run = async (): Promise<void> => {
        await this.mt.download()
        await this.update()
        await this.cc.term.clear()
        await this.cc.term.setCursorPos({ x: 1, y: 1 })
        return this.cc.exec<void>(`dofile("${this.getPath()}")()`)
    }
}
