import { MidiData } from "midi-file"
import getData from "./data"
import { convertMidiToChords } from "./midi/parser"
import { unpackPattern } from "./notes"
import { defineEntry, enter } from "./util/entry"
import { setSeed } from "./util/rng"
import startViz from "./viz"
import { PianoRoll } from "./viz/components/pianoRoll"
import { createVizElement } from "./viz/jsx"

defineEntry("test", (argv) => {
    console.log(getData("test/file.json"))
})

defineEntry("viz_test", (argv) => {
    startViz("Hello!")
})

defineEntry("midi_parse", (argv) => {
    const path = argv.input ?? "midi/test.mid"

    const pattern = convertMidiToChords(getData(path) as MidiData)
    console.log(pattern)

    if (argv.viz) {
        startViz(<PianoRoll pattern={unpackPattern(pattern)}/>)
    }
})

export default function ix8r(entry: string, argv: any) {
    if (argv.seed) {
        setSeed(argv.seed)
    }

    enter(entry, argv)
}