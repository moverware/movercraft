import * as dotenv from 'dotenv'
dotenv.config()

import { Server } from 'ws'
import { StateMachine } from './src/StateMachine'
import { TurtleC } from './src/TurtleC'

const port = 3000

const wss = new Server({ port })

const machine = new StateMachine()

wss.on('connection', async (ws) => {
    console.log('connection!')
    const turtle = new TurtleC(ws, machine)
    await turtle.init()
    // ws.send(
    //     JSON.stringify({
    //         type: 'eval',
    //         fn: 'return turtle.turnLeft()',
    //         nonce: 1,
    //     })
    // )
    // ws.on('message', async (message: string) => {
    //     console.log('sending: ' + message)
    //     ws.send('I got: ' + message)
    // })
})

console.log('done')
