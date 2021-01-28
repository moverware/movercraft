import WebSocket from 'ws'

import { Command } from './Command'

export class FS extends Command {
    constructor(ws: WebSocket) {
        super(ws)
    }

    public exists = async (path: string): Promise<boolean> => {
        return this.exec<boolean>(`fs.exists("${path}")`)
    }

    public delete = async (path: string): Promise<void> => {
        return this.exec<void>(`fs.delete("${path}")`)
    }

    public writeToPath = async (path: string, data: string): Promise<void> => {
        return this.exec<void>(
            `(function() local f = fs.open("${path}", "w"); f.write("${data}"); f.close() end)()`
        )
    }
}
