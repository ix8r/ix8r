import { countIntersections } from "../util/array"
import { chordMappings, notes, scaleMappings } from "./lookup"

export type Note = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B"

export type ChordType = "major" | "minor" | "diminished"
export type ChordInversion = 0 | 1 | 2
export type Chord = {
    root: Note,
    type: ChordType,
    inversion?: ChordInversion
}

export function shiftNote(note: Note, semitones: number) {
    const index = notes.indexOf(note)

    let shift = (index + semitones) % notes.length
    if (shift < 0) {
        shift += notes.length
    }

    return notes[shift]
}

function notesEqual(notes1: Note[], notes2: Note[]) {
    if (notes1.length !== notes2.length) {
        return false
    }

    return notes1.reduce((acc, note, i) => acc + (note === notes2[i] ? 1 : 0), 0) === notes1.length
}

export function unpackChord(chord: Chord) {
    const mapping = chordMappings.find(
        mapping => mapping.chord.root === chord.root
                && mapping.chord.type === chord.type
                && (mapping.chord.inversion === chord.inversion ?? 0)
    )
    if (!mapping) {
        return null
    }

    return mapping.notes
}

export function packChord(notes: Note[]) {
    const mapping = chordMappings.find(
        mapping => notesEqual(notes, mapping.notes)
    )
    if (!mapping) {
        return null
    }

    return mapping.chord
}

export type Mode = "ionian" | "dorian" | "phrygian" | "lydian" | "mixolydian" | "aeolian" | "locrian"
export type Scale = {
    root: Note,
    mode: Mode
}

export function getScaleChord(scale: Scale, degree: number) {
    const mapping = scaleMappings.find(
        mapping => mapping.mode === scale.mode
                && mapping.root === scale.root
    )
    if (!mapping) {
        return null
    }

    const scaleNotes = mapping.notes
    const chordNotes: Note[] = []

    for (let i = 0; i < 3; i++) {
        chordNotes.push(
            scaleNotes[(degree + i * 2) % scaleNotes.length]
        )
    }

    return packChord(chordNotes)
}

export function getScalesFromNotes(notes: Note[]) {
    const candidates: {
        scale: Scale,
        similarity: number
    }[] = []
    let maxSimilarity = 0

    scaleMappings.forEach(mapping => {
        const similarity = countIntersections(notes, mapping.notes)

        maxSimilarity = Math.max(similarity, maxSimilarity)

        if (similarity > 0) {
            candidates.push({
                scale: {
                    root: mapping.root,
                    mode: mapping.mode
                },
                similarity
            })
        }
    })

    return candidates.filter(
        c => c.similarity === maxSimilarity
    ).map(
        c => c.scale
    )
}

type PatternNoteItem = {
    type: "note",
    note: Note
}

type PatternChordItem = {
    type: "chord",
    chord: Chord
}

export type PatternItem = {
    start: number,
    length: number
} & (PatternNoteItem | PatternChordItem)