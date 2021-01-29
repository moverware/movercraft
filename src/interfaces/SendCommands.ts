export interface EvalCommand {
    type: 'eval'
    fn: string
    nonce?: string
}

export interface PastebinGetCommand {
    type: 'pastebinGet'
    code: string
    path: string
    nonce?: string
}

export type Cmd = EvalCommand | PastebinGetCommand
