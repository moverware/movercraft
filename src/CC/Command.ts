import WebSocket from 'ws'
import { getNonce } from 'get-nonce'

import { Cmd } from '../interfaces/SendCommands'
import CResponse from '../interfaces/CResponse'
import { StateMachine, Label } from '../StateMachine'

type Res = string

export class Command {
    private replay: boolean
    private programName: string
    private trackingCmds: boolean

    constructor(
        private ws: WebSocket,
        protected machine: StateMachine,
        protected label: Label
    ) {
        this.replay = false
        this.programName = null
        this.trackingCmds = false
    }

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
                        if (this.trackingCmds) {
                            this.machine.addCmd(
                                this.label,
                                cRes.data,
                                this.programName
                            )
                        }

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
        if (this.replay) {
            const res = this.machine.getNextReplay(this.label)
            if (res[0]) {
                return new Promise((resolve) => {
                    resolve(res[1])
                })
            }
            this.replay = false
            this.trackingCmds = true
        }
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

    public setReplay = () => {
        this.replay = true
        this.trackingCmds = false
    }

    public setProgramName = (name: string) => {
        this.programName = name
        this.trackingCmds = true
    }

    public clearProgramName = () => {
        this.programName = null
    }
}
