import WebSocket from 'ws'

import { Command } from './Command'
import { OSEvent, OSKeyEvent, OSMouseEvent } from '../interfaces/OSEvents'

type Filter = 'key' | 'mouse_click'

export class OS extends Command {
    constructor(ws: WebSocket) {
        super(ws)
    }

    public getComputerLabel = async (): Promise<string> => {
        return this.exec<string>('os.getComputerLabel()')
    }

    public setComputerLabel = async (label: string): Promise<void> => {
        return this.exec<void>(`os.setComputerLabel("${label}")`)
    }

    public getComputerID = async (): Promise<number> => {
        return this.exec<number>('os.getComputerID()')
    }

    public pullEvent = async (filter: Filter): Promise<OSEvent> => {
        if (filter === 'key') {
            return this.exec<OSKeyEvent>(
                '(function() event,key = os.pullEvent("key"); return {event = event, key = key}  end)()'
            )
        } else if (filter === 'mouse_click') {
            return this.exec<OSMouseEvent>(
                '(function() event,button,x,y = os.pullEvent("mouse_click"); return {event = event, button = button, x = x, y = y}  end)()'
            )
        }
    }
}
