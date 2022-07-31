import { Chord, ChordInversion, ChordType, Mode, Note } from "."

export const notes: Note[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
export const chordTypes: ChordType[] = ["major", "minor", "diminished"]
export const chordInversions: ChordInversion[] = [0, 1, 2]

export const chordMappings: {
    chord: Chord,
    notes: Note[]
}[] = []

function generateChordMappings() {
    for (const root of notes) {
        const rootIndex = notes.indexOf(root)

        for (const type of chordTypes) {
            const third = (type === "major") ? notes[(rootIndex + 4) % notes.length] : notes[(rootIndex + 3) % notes.length]
            const fifth = (type === "diminished") ? notes[(rootIndex + 6) % notes.length] : notes[(rootIndex + 7) % notes.length]

            for (const inversion of chordInversions) {
                const baseNotes = [root, third, fifth]
                const notes = [
                    baseNotes[(0 + inversion) % 3],
                    baseNotes[(1 + inversion) % 3],
                    baseNotes[(2 + inversion) % 3]
                ]

                chordMappings.push({
                    chord: {
                        root, type, inversion
                    },
                    notes
                })
            }
        }
    }
}

generateChordMappings()

export const modes: Mode[] = ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"]

export const scaleMappings: {
    root: Note,
    mode: Mode,
    notes: Note[]
}[] = []

function generateScaleMappings() {
    const offsets = [2, 2, 1, 2, 2, 2, 1]

    for (const root of notes) {
        for (const mode of modes) {
            const modeIndex = modes.indexOf(mode)

            const scaleNotes: Note[] = [root]
            let offset = 0

            for (let i = 1; i < 7; i++) {
                offset = offsets[(i - 1 + modeIndex) % offsets.length]

                const index = notes.indexOf(scaleNotes[i - 1])
                scaleNotes.push(notes[(index + offset) % notes.length])
            }

            scaleMappings.push({
                root, mode, notes: scaleNotes
            })
        }
    }
}

generateScaleMappings()