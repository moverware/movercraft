import WebSocket from 'ws'

import { Command } from './Command'
import { OSEvent, OSKeyEvent, OSMouseEvent } from '../interfaces/OSEvents'
import { Label, StateMachine } from '../StateMachine'

type Filter = 'key' | 'mouse_click'

export class OS {
    constructor(private command: Command) {}

    public getComputerLabel = async (): Promise<string> => {
        return this.command.exec<string>('os.getComputerLabel()')
    }

    public setComputerLabel = async (label: string): Promise<void> => {
        return this.command.exec<void>(`os.setComputerLabel("${label}")`)
    }

    public getComputerID = async (): Promise<number> => {
        return this.command.exec<number>('os.getComputerID()')
    }

    public pullEvent = async (filter: Filter): Promise<OSEvent> => {
        if (filter === 'key') {
            return this.command.exec<OSKeyEvent>(
                '(function() event,key = os.pullEvent("key"); return {event = event, key = key}  end)()'
            )
        } else if (filter === 'mouse_click') {
            return this.command.exec<OSMouseEvent>(
                '(function() event,button,x,y = os.pullEvent("mouse_click"); return {event = event, button = button, x = x, y = y}  end)()'
            )
        }
    }
}
