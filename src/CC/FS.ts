import { Command } from './Command'

export class FS {
    constructor(private command: Command) {}

    public exists = async (path: string): Promise<boolean> => {
        return this.command.exec<boolean>(`fs.exists("${path}")`)
    }

    public delete = async (path: string): Promise<void> => {
        return this.command.exec<void>(`fs.delete("${path}")`)
    }

    public writeToPath = async (path: string, data: string): Promise<void> => {
        return this.command.exec<void>(
            `(function() local f = fs.open("${path}", "w"); f.write("${data}"); f.close() end)()`
        )
    }

    public readFromPath = async (path: string): Promise<string> => {
        return this.command.exec<string>(
            `(function() local f = fs.open("${path}", "r"); local data = f.readAll(); f.close(); return data end)()`
        )
    }
}
