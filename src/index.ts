import { MidiData } from "midi-file"
import getData from "./data"
import { convertMidiToChords } from "./midi/parser"
import { defineEntry, enter } from "./util/entry"

defineEntry("test", (argv) => {
    console.log(getData("test/file.json"))
})

defineEntry("midi_parse", (argv) => {
    const path = argv.input ?? "midi/test.mid"

    console.log(convertMidiToChords(getData(path) as MidiData))
})

export default function ix8r(entry: string, argv: any) {
    enter(entry, argv)
}