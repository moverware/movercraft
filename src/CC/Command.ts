import WebSocket from 'ws'
import { getNonce } from 'get-nonce'

import SendCommand from '../interfaces/SendCommand'
import CResponse from '../interfaces/CResponse'

type Res = string

export class Command {
    constructor(private ws: WebSocket) {}

    public exec = <T>(val: string): Promise<T> => {
        return new Promise((resolve, reject) => {
            const nonce = getNonce()
            const command: SendCommand = {
                type: 'eval',
                fn: `return ${val}`,
                nonce,
            }
            console.log(`return ${val}`)
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
}
