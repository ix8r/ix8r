type EntryFunction = (argv: any) => void

const entryPoints = new Map<string, EntryFunction>()

export function defineEntry(name: string, entry: EntryFunction) {
    entryPoints.set(name, entry)
}

export function enter(name: string, argv: any) {
    if (!entryPoints.has(name)) {
        console.log(`Unknown entry point ${name}`)
        return
    }

    entryPoints.get(name)!(argv)
}
