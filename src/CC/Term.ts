import WebSocket from 'ws'

import { Command } from './Command'
import Cursor from '../interfaces/Cursor'

export class Term extends Command {
    constructor(ws: WebSocket) {
        super(ws)
    }

    public clear = async (): Promise<null> => {
        return this.exec<null>('term.clear()')
    }

    public clearLine = async (): Promise<null> => {
        return this.exec<null>('term.clearLine()')
    }

    public getCursorPos = async (): Promise<Cursor> => {
        return this.exec<Cursor>(
            '(function() x,y = term.getCursorPos(); return {x = x, y = y}  end)()'
        )
    }

    public setCursorPos = async (cursor: Cursor): Promise<null> => {
        return this.exec<null>(`term.setCursorPos(${cursor.x},${cursor.y})`)
    }

    public scroll = async (lines: number): Promise<null> => {
        return this.exec<null>(`term.scroll(${lines})`)
    }

    public write = async (text: string): Promise<null> => {
        return this.exec<null>(`term.write("${text}")`)
    }
}
