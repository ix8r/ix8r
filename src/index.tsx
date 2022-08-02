import { MidiData } from "midi-file"
import { createArrangement } from "./arranger"
import { processTemplate } from "./arranger/structure"
import { StructureFile } from "./arranger/structure/types"
import getData from "./data"
import { convertMidiToChords } from "./midi/parser"
import { unpackPattern } from "./notes"
import { defineEntry, enter } from "./util/entry"
import { setSeed } from "./util/rng"
import startViz from "./viz"
import { ArrangementRoll } from "./viz/components/arrangementRoll"
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

defineEntry("arranger_structure", (argv) => {
    const name = argv.structure ?? "versechorus"

    const template = getData(`arranger/structure/${name}.json`) as StructureFile
    
    const structure = processTemplate(template)
    console.log(structure)
})

defineEntry("arranger", (argv) => {
    const name = argv.structure ?? "versechorus"

    const template = getData(`arranger/structure/${name}.json`) as StructureFile
    
    const arrangement = createArrangement(template)
    console.log(JSON.stringify(arrangement, null, 4))

    if (argv.viz) {
        startViz(<ArrangementRoll arrangement={arrangement}/>)
    }
})

export default function ix8r(entry: string, argv: any) {
    if (argv.seed) {
        setSeed(argv.seed)
    }

    enter(entry, argv)
}