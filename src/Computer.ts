import { v4 as uuidV4 } from 'uuid'
import WebSocket from 'ws'
import { CC } from './CC/CC'
import pokemon from './fun/Pokemon'
import CResponse from './interfaces/CResponse'
import { UUID, StateMachine } from './StateMachine'

const UUID_PATH = '/moverTools/uuid'

export class Computer {
    protected cc: CC
    protected id: number
    protected label: string
    protected closed: boolean
    protected uuid: UUID

    constructor(protected ws: WebSocket, private machine: StateMachine) {
        this.cc = new CC(ws, '__init__', machine)
        this.closed = false
    }

    public async init() {
        this.ws.on('message', this.killListener)
        this.ws.on('close', () => {
            this.closed = true
            console.log(`Websocket was closed for: ${this.uuid}`)
        })
        this.ws.send(JSON.stringify({ ready: true }))

        await this.getUUID()
        console.log(`Init computer: ${this.uuid}`)

        this.cc = new CC(this.ws, this.uuid, this.machine)

        const label = await this.cc.os.getComputerLabel()
        if (label) {
            this.label = label
        } else {
            this.label = pokemon[Math.floor(Math.random() * pokemon.length)]
            await this.cc.os.setComputerLabel(this.label)
        }
        this.id = await this.cc.os.getComputerID()
    }

    private getUUID = async () => {
        const exists = await this.cc.fs.exists(UUID_PATH)
        console.log(`Exists: ${exists}`)
        if (exists) {
            this.uuid = await this.cc.fs.readFromPath(UUID_PATH)
        } else {
            const uuid = uuidV4()
            await this.cc.fs.writeToPath(UUID_PATH, uuid)
            this.uuid = uuid
        }
    }

    private killListener = async (res: string) => {
        try {
            const cRes: CResponse = JSON.parse(res)
            if (cRes?.kill === true) {
                await this.getUUID()
                console.log(`killing ${this.uuid}`)
                this.machine.resetState(this.uuid)
            }
        } catch (err) {
            console.log(`Error parsing kill message check for ${this.uuid}`)
        }
    }
}
