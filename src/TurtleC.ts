import WebSocket from 'ws'
import { Computer } from './Computer'
import { Attack } from './Programs/Attack'
import { AttackPB } from './Programs/AttackPB'
import { MainMenu } from './Programs/MainMenu'
import { TorchMine } from './Programs/TorchMine'
import { Wheat } from './Programs/Wheat'
import { Label, StateMachine } from './StateMachine'

export class TurtleC extends Computer {
    private fuelLevel: number
    private fuelLimit: number
    private selectedSlot: number

    // programs
    private menu: MainMenu
    private torchMine: TorchMine
    private wheat: Wheat
    private attack: AttackPB
    private attackBeta: Attack
    private programs: string[]

    constructor(ws: WebSocket, machine: StateMachine) {
        super(ws, machine)
    }

    public init = async () => {
        await super.init()

        this.torchMine = new TorchMine(this.cc)
        this.wheat = new Wheat(this.cc)
        this.attack = new AttackPB(this.cc)
        this.attackBeta = new Attack(this.cc)

        this.programs = [
            'torchMine',
            'wheat',
            'attack',
            this.attackBeta.getName(),
        ]
        this.menu = new MainMenu(this.cc, this.programs)

        this.fuelLevel = await this.cc.turtle.getFuelLevel()
        this.fuelLimit = await this.cc.turtle.getFuelLimit()
        this.selectedSlot = await this.cc.turtle.getSelectedSlot()

        try {
            await this.programLoop()
        } catch (err) {
            console.log(err)
        }
    }

    private programLoop = async () => {
        while (true) {
            const hasReplay = this.cc.hasReplay()
            const replay = hasReplay[0]
            const input = replay ? hasReplay[1] : await this.menu.runMenu()

            switch (input) {
                case 'torchMine':
                    await this.torchMine.run()
                    break
                case 'wheat':
                    await this.wheat.run()
                    break
                case 'attack':
                    await this.attack.run()
                    break
                case this.attackBeta.getName():
                    await this.attackBeta.run(replay)
                    break
            }
        }
    }
}
