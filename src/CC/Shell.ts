import WebSocket from 'ws'

import { Command } from './Command'

export class Shell extends Command {
    constructor(ws: WebSocket) {
        super(ws)
    }

    public runPastebin = async (
        mode: 'put' | 'get',
        code: string,
        path: string
    ): Promise<boolean> => {
        switch (mode) {
            case 'put':
                return this.exec<boolean>(
                    `shell.run("pastebin", "put", "${code}")`
                )
            case 'get':
                return this.exec<boolean>(
                    `shell.run("pastebin", "get", "${code}", "${path}")`
                )
        }
    }
}
