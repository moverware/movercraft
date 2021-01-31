import { Command } from './Command'

export class HTTP {
    constructor(private command: Command) {}

    public get = async (url: string): Promise<string> => {
        return this.command.exec<string>(
            `(function() res = http.get("${url}"); if res then local sRes = res.readAll(); res.close(); return sRes; else return "HTTP GET FAILED" end end)()`
        )
    }
}
