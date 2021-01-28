import WebSocket from 'ws'
import { OS } from './OS'
import { Turtle } from './Turtle'
import { Term } from './Term'

export class CC {
    public turtle: Turtle
    public os: OS
    public term: Term

    constructor(ws: WebSocket) {
        this.turtle = new Turtle(ws)
        this.os = new OS(ws)
        this.term = new Term(ws)
    }
}
