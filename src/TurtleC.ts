import WebSocket from 'ws'
import { Computer } from './Computer'
import { MainMenu } from './Programs/MainMenu'
import { TorchMine } from './Programs/TorchMine'

const programs = ['torchMine', 'hello Jules']

export class TurtleC extends Computer {
    private fuelLevel: number
    private fuelLimit: number
    private selectedSlot: number

    // programs
    private menu: MainMenu
    private torchMine: TorchMine

    constructor(ws: WebSocket) {
        super(ws)
        this.menu = new MainMenu(this.cc, programs)
        this.torchMine = new TorchMine(this.cc)
    }

    public init = async () => {
        await super.init()
        this.fuelLevel = await this.cc.turtle.getFuelLevel()
        this.fuelLimit = await this.cc.turtle.getFuelLimit()
        this.selectedSlot = await this.cc.turtle.getSelectedSlot()

        while (true) {
            const input = await this.menu.runMenu()
            switch (input) {
                case 'torchMine':
                    await this.torchMine.run()
                    break
            }
        }
    }
}
