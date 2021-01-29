import { CC } from '../CC/CC'

export abstract class Pastebin {
    constructor(protected cc: CC) {}

    protected abstract getCode(): string
    protected abstract getFilename(): string

    protected getPath(): string {
        return `/moverTools/${this.getFilename()}`
    }

    protected resetTerm = async () => {
        await this.cc.term.clear()
        await this.cc.term.setCursorPos({ x: 1, y: 1 })
    }

    public update = async (): Promise<void> => {
        if (await this.cc.fs.exists(this.getPath())) {
            await this.cc.fs.delete(this.getPath())
        }
        await this.cc.command.pastebinGet(this.getCode(), this.getPath())
        await this.resetTerm()
        // const code = await this.cc.http.get(
        //     `http://pastebin.com/raw/${this.getCode()}`
        // )
        // return this.cc.fs.writeToPath(this.getPath(), code)
        // return this.cc.shell.runPastebin('get', this.getCode(), this.getPath())
    }
}
