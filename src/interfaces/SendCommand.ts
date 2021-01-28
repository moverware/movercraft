export default interface SendCommand {
    type: 'eval'
    fn: string
    nonce: string
}
