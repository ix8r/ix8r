import { packChord } from "../notes"
import { notes } from "../notes/lookup"

function midiIndexToNote(index: number) {
    let noteIndex = (index - 24) % 12
    if (noteIndex < 0) {
        noteIndex += 12
    }

    return notes[noteIndex]
}

export function processMidiChord(indices: number[]) {
    const notes = indices.sort(
        (i1, i2) => i1 - i2
    ).map(
        i => midiIndexToNote(i)
    )

    return packChord(notes)
}