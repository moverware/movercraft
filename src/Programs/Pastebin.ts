import { CC } from '../CC/CC'

export abstract class Pastebin {
    constructor(protected cc: CC) {}

    protected abstract getCode(): string
    protected abstract getFilename(): string

    protected getPath(): string {
        return `/moverTools/${this.getFilename()}`
    }

    public update = async (): Promise<void> => {
        if (await this.cc.fs.exists(this.getPath())) {
            await this.cc.fs.delete(this.getPath())
        }
        console.log('about to fetch')
        const code = await this.cc.http.get(
            `http://pastebin.com/raw/${this.getCode()}`
        )
        console.log('done fetching:')
        console.log(code)
        // return this.cc.fs.writeToPath(this.getPath(), code)
        // return this.cc.shell.runPastebin('get', this.getCode(), this.getPath())
    }
}
