interface OSKeyEvent {
    event: string
    key: number
}

interface OSMouseEvent {
    event: string
    button: string
    x: number
    y: number
}

type OSEvent = OSKeyEvent | OSMouseEvent

export { OSKeyEvent, OSMouseEvent, OSEvent }
