import WebSocket from 'ws'
import { Computer } from './Computer'
import { Attack } from './Programs/Attack'
import { AttackPB } from './Programs/AttackPB'
import { MainMenu } from './Programs/MainMenu'
import { TorchMine } from './Programs/TorchMine'
import { Wheat } from './Programs/Wheat'
import { RyanMine } from './Programs/RyanMine_local'
import { StateMachine } from './StateMachine'
import { BusyBee } from './Programs/BusyBee'

export class TurtleC extends Computer {
    private fuelLevel: number
    private fuelLimit: number
    private selectedSlot: number

    // programs
    private menu: MainMenu
    private torchMine: TorchMine
    private wheat: Wheat
    private attackLocal: AttackPB
    private attack: Attack
    private ryanMine: RyanMine
    private programs: string[]
    private busyBee: BusyBee

    constructor(ws: WebSocket, machine: StateMachine) {
        super(ws, machine)
    }

    public init = async () => {
        await super.init()

        this.torchMine = new TorchMine(this.cc)
        this.wheat = new Wheat(this.cc)
        this.attackLocal = new AttackPB(this.cc)
        this.attack = new Attack(this.cc)
        this.ryanMine = new RyanMine(this.cc)
        this.busyBee = new BusyBee(this.cc)

        this.programs = [
            this.torchMine.getName(),
            this.wheat.getName(),
            this.attackLocal.getName(),
            this.attack.getName(),
            this.ryanMine.getName(),
            this.busyBee.getName(),
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
            const hasReplay = await this.cc.hasReplay()
            const replay = hasReplay[0]
            const input = replay ? hasReplay[1] : await this.menu.runMenu()

            switch (input) {
                case this.torchMine.getName():
                    await this.torchMine.run()
                    break
                case this.wheat.getName():
                    await this.wheat.run()
                    break
                case this.attackLocal.getName():
                    await this.attackLocal.run()
                    break
                case this.attack.getName():
                    await this.attack.run(replay)
                    break
                case this.ryanMine.getName():
                    await this.ryanMine.run()
                    break
                case this.busyBee.getName():
                    await this.busyBee.run(replay)
                default:
                    // Replaying an outdated program
                    console.log(
                        'Resetting P State, should only happen if a program was updated recently'
                    )
                    await this.cc.resetPState()
            }
        }
    }
}
