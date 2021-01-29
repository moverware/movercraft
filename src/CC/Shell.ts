import WebSocket from 'ws'
import { Label, StateMachine } from '../StateMachine'

import { Command } from './Command'

export class Shell {
    constructor(private command: Command) {}

    public runPastebin = async (
        mode: 'put' | 'get',
        code: string,
        path: string
    ): Promise<boolean> => {
        switch (mode) {
            case 'put':
                return this.command.exec<boolean>(
                    `shell.run("pastebin", "put", "${code}")`
                )
            case 'get':
                return this.command.exec<boolean>(
                    `shell.run("pastebin", "get", "${code}", "${path}")`
                )
        }
    }
}
