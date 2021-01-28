import WebSocket from 'ws'
import { OS } from './OS'
import { Turtle } from './Turtle'

export class CC {
    public turtle: Turtle
    public os: OS

    constructor(ws: WebSocket) {
        this.turtle = new Turtle(ws)
        this.os = new OS(ws)
    }
}
