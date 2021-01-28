import WebSocket from 'ws'

export class Computer {
    private id: number
    private label: string

    constructor(private ws: WebSocket) {}
}
