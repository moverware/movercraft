import WebSocket from 'ws'
import { getNonce } from 'get-nonce'

import { Cmd, EvalCommand } from '../interfaces/SendCommands'
import CResponse from '../interfaces/CResponse'

type Res = string

export class Command {
    constructor(private ws: WebSocket) {}

    private sendCommand = <T>(command: Cmd): Promise<T> => {
        return new Promise((resolve, reject) => {
            const nonce = getNonce()
            command.nonce = nonce

            // console.log(`return ${val}`)
            this.ws.send(JSON.stringify(command))

            const listener = (res: Res) => {
                try {
                    const cRes: CResponse = JSON.parse(res)
                    if (cRes?.nonce === nonce) {
                        resolve(cRes.data)
                        this.ws.off('message', listener)
                    }
                } catch (err) {
                    reject(err)
                }
            }

            this.ws.on('message', listener)
        })
    }

    public exec = <T>(val: string): Promise<T> => {
        return this.sendCommand({
            type: 'eval',
            fn: `return ${val}`,
        })
    }

    public pastebinGet = (code: string, path: string): Promise<boolean> => {
        return this.sendCommand({
            type: 'pastebinGet',
            code,
            path,
        })
    }
}
