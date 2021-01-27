import * as dotenv from 'dotenv'
dotenv.config()

import { Server } from 'ws'

const port = 3000

const wss = new Server({ port })

wss.on('connection', async (ws) => {
    console.log('connection!')
    ws.send(
        JSON.stringify({
            type: 'eval',
            fn: 'return turtle.turnLeft()',
            nonce: 1,
        })
    )
    // ws.on('message', async (message: string) => {
    //     console.log('sending: ' + message)
    //     ws.send('I got: ' + message)
    // })
})

console.log('done')
