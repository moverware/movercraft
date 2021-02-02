import { CC } from '../CC/CC'

const ROWS_PER_PAGE = 11

export class MainMenu {
    private page: number
    private totalPages: number
    private multiFound: boolean
    constructor(private cc: CC, private programs: string[]) {
        this.page = 1
        this.totalPages = Math.ceil(
            Math.ceil(this.programs.length / 2) / ROWS_PER_PAGE
        )
        this.multiFound = false
    }

    private resetMenu = async (): Promise<void> => {
        await this.cc.term.clear()
        await this.cc.term.setCursorPos({ x: 1, y: 13 })
        await this.cc.term.setTextColor('cyan')
        await this.cc.term.write('> ')
        await this.cc.term.setTextColor('white')

        await this.listPrograms()
        await this.resetCursor()
    }

    private resetCursor = async (): Promise<void> => {
        await this.cc.term.setCursorPos({ x: 3, y: 13 })
    }

    private checkNext = (input: string): boolean => {
        input = input.toLowerCase()
        return input.includes('next')
    }

    private checkPrevious = (input: string): boolean => {
        input = input.toLowerCase()
        return input.includes('prev')
    }

    private incPage = (): boolean => {
        if (this.page < this.totalPages) {
            this.page++
            return true
        }
        return false
    }

    private decPage = (): boolean => {
        if (this.page > 1) {
            this.page--
            return true
        }
        return false
    }

    private checkForProgram = async (name: string): Promise<string> => {
        const n = name.toLowerCase()
        let found = []
        for (const program of this.programs) {
            const p = program.toLowerCase()
            const prefix = p.split('_')[0]

            if (prefix.includes(n)) found.push(program)
        }
        if (found.length === 1) return found[0]

        found = []
        for (const program of this.programs) {
            const p = program.toLowerCase()

            if (p.includes(n)) found.push(program)
        }
        if (found.length === 1) return found[0]
        if (found.length > 1) {
            await this.displayError(`Multiple programs found: ${name}`)
            this.multiFound = true
        }

        return null
    }

    public runMenu = async (): Promise<string> => {
        await this.resetMenu()
        let input = await this.cc.read()
        let programName = await this.checkForProgram(input)
        while (!programName) {
            if (this.checkNext(input)) {
                const suc = this.incPage()
                if (!suc) {
                    await this.displayError('No next page')
                }
            } else if (this.checkPrevious(input)) {
                const suc = this.decPage()
                if (!suc) {
                    await this.displayError('No previous page')
                }
            } else if (!this.multiFound) {
                await this.displayError(`Not Found: ${input}`)
            } else {
                this.multiFound = false
            }

            await this.resetMenu()
            input = await this.cc.read()
            programName = await this.checkForProgram(input)
        }
        return programName
    }

    public displayError = async (error: string): Promise<void> => {
        await this.cc.term.clear()
        await this.cc.term.setCursorPos({ x: 1, y: 1 })
        await this.cc.term.setTextColor('red')
        await this.cc.term.write('Error: ' + error)

        await this.cc.term.setCursorPos({ x: 1, y: 2 })
        await this.cc.term.setTextColor('white')
        await this.cc.term.write('Press any key to continue...')
        await this.cc.os.pullEvent('key')
    }

    private listPrograms = async (): Promise<void> => {
        let currRow = 1
        for (
            let i = (this.page - 1) * ROWS_PER_PAGE;
            i < this.programs.length && currRow < ROWS_PER_PAGE;
            i += 2
        ) {
            await this.cc.term.setCursorPos({ x: 1, y: currRow })
            await this.cc.term.write(this.programs[i])
            if (i + 1 < this.programs.length) {
                await this.cc.term.setCursorPos({ x: 19, y: currRow })
                await this.cc.term.write(this.programs[i + 1])
            }
            currRow++
        }

        await this.cc.term.setCursorPos({ x: 18, y: ROWS_PER_PAGE + 1 })
        await this.cc.term.write(`${this.page}/${this.totalPages}`)

        if (currRow >= ROWS_PER_PAGE && this.page < this.totalPages) {
            await this.cc.term.setCursorPos({ x: 34, y: ROWS_PER_PAGE + 1 })
            await this.cc.term.write('[Next]')
        }

        if (this.page > 1) {
            await this.cc.term.setCursorPos({ x: 1, y: ROWS_PER_PAGE + 1 })
            await this.cc.term.write('[Prev]')
        }
    }
}
