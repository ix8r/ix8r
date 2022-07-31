type EntryFunction = (argv: any) => void

const entryPoints = new Map<string, EntryFunction>()

export function defineEntry(name: string, entry: EntryFunction) {
    entryPoints.set(name, entry)
}

export function enter(name: string, argv: any) {
    if (!entryPoints.has(name)) {
        console.log(`Unknown entry point '${name}'\n`)

        console.log("Known entry points:")
        console.log([...entryPoints.keys()].map(s => `\t${s}`).join("\n"))
        return
    }

    entryPoints.get(name)!(argv)
}
