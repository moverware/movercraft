import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'

import { Cmd } from '../interfaces/SendCommands'
import CResponse from '../interfaces/CResponse'
import { StateMachine, UUID } from '../StateMachine'

type Res = string

export class Command {
    private replay: boolean
    private programName: string
    private trackingCmds: boolean

    constructor(
        private ws: WebSocket,
        protected machine: StateMachine,
        protected uuid: UUID
    ) {
        this.replay = false
        this.programName = null
        this.trackingCmds = false
    }

    private sendCommand = <T>(
        command: Cmd,
        sendInReplay: boolean = false
    ): Promise<T> => {
        return new Promise((resolve, reject) => {
            const nonce = uuidv4()
            command.nonce = nonce

            // console.log(`return ${val}`)
            this.ws.send(JSON.stringify(command))

            const listener = (res: Res) => {
                try {
                    const cRes: CResponse = JSON.parse(res)
                    if (cRes?.nonce === nonce) {
                        if (this.trackingCmds && !sendInReplay) {
                            this.machine.addCmd(
                                this.uuid,
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
            if (this.ws.listenerCount('message') > this.ws.getMaxListeners()) {
                console.log(
                    'Adding too many listeners. Did you clear your loops on disconnect?'
                )
            }
        })
    }

    public exec = <T>(
        val: string,
        sendInReplay: boolean = false
    ): Promise<T> => {
        if (this.replay) {
            if (!sendInReplay) {
                const res = this.machine.getNextReplay(this.uuid)
                if (res[0]) {
                    return new Promise((resolve) => {
                        resolve(res[1])
                    })
                }
                this.replay = false
                this.trackingCmds = true
            }
        }
        return this.sendCommand(
            {
                type: 'eval',
                fn: `return ${val}`,
            },
            sendInReplay
        )
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
}
