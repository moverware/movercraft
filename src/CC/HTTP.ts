import WebSocket from 'ws'

import { Command } from './Command'

export class HTTP extends Command {
    constructor(ws: WebSocket) {
        super(ws)
    }

    public get = async (url: string): Promise<string> => {
        return this.exec<string>(
            `(function() res = http.get("${url}"); if res then local sRes = res.readAll(); res.close(); return sRes; else return "HTTP GET FAILED" end end)()`
        )
    }
}
