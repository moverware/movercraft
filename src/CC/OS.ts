import WebSocket from 'ws'

import { Command } from './Command'

export class OS extends Command {
    constructor(ws: WebSocket) {
        super(ws)
    }

    public getComputerLabel = async (): Promise<string> => {
        return this.exec<string>('os.getComputerLabel()')
    }

    public setComputerLabel = async (label: string): Promise<null> => {
        return this.exec<null>(`os.setComputerLabel("${label}")`)
    }

    public getComputerID = async (): Promise<number> => {
        return this.exec<number>('os.getComputerID()')
    }
}
