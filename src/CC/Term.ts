import { Command } from './Command'
import Cursor from '../interfaces/Cursor'
import { Color } from '../interfaces/Color'

export class Term {
    constructor(private command: Command) {}

    public clear = async (): Promise<void> => {
        return this.command.exec<void>('term.clear()', true)
    }

    public clearLine = async (): Promise<void> => {
        return this.command.exec<void>('term.clearLine()', true)
    }

    public getCursorPos = async (): Promise<Cursor> => {
        return this.command.exec<Cursor>(
            '(function() x,y = term.getCursorPos(); print(x);return {x = x, y = y}  end)()',
            true
        )
    }

    public setCursorPos = async (cursor: Cursor): Promise<void> => {
        return this.command.exec<void>(
            `term.setCursorPos(${cursor.x},${cursor.y})`,
            true
        )
    }

    public scroll = async (lines: number): Promise<void> => {
        return this.command.exec<void>(`term.scroll(${lines})`, true)
    }

    public write = async (text: string): Promise<void> => {
        return this.command.exec<void>(`term.write("${text}")`, true)
    }

    public setTextColor = async (color: Color): Promise<void> => {
        return this.command.exec<void>(
            `term.setTextColor(colors.${color})`,
            true
        )
    }

    public reset = async (): Promise<void> => {
        await this.clear()
        await this.setCursorPos({ x: 1, y: 1 })
        await this.setTextColor('white')
    }
}
