import { arraysEqual, countIntersections } from "../util/array"
import { chordMappings, notes, scaleMappings } from "./lookup"

export type Note = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B"
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type NoteOctave = `${Note}${Octave}`

export function getNote(note: Note | NoteOctave) {
    if (isNaN(+note.at(-1)!)) {
        return note as Note
    }

    return note.substring(0, note.length - 1) as Note
}

export function getOctave(note: Note | NoteOctave) {
    const octave = +note.at(-1)!

    return (isNaN(octave) ? 4 : octave) as Octave
}

export function setOctave(note: Note | NoteOctave, octave: Octave) {
    return `${getNote(note)}${octave}` as NoteOctave
}

export function shiftNote(note: Note, semitones: number) {
    const index = notes.indexOf(note)

    let shift = (index + semitones) % notes.length
    if (shift < 0) {
        shift += notes.length
    }

    return notes[shift]
}

export function shiftNoteOctave(noteoct: NoteOctave, semitones: number) {
    const note = getNote(noteoct)
    const octaveShift = Math.floor((notes.indexOf(note) + semitones) / notes.length)

    return setOctave(shiftNote(note, semitones), getOctave(noteoct) + octaveShift as Octave)
}

export function stripOctaves(notes: (Note | NoteOctave)[]) {
    return notes.map(note => getNote(note))
}

export type ChordType = "major" | "minor" | "diminished"
export type ChordInversion = 0 | 1 | 2
export type Chord = {
    root: Note,
    type: ChordType,
    inversion?: ChordInversion,
    octave?: Octave
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

    let octave = chord.octave ?? 4
    const out: NoteOctave[] = []

    for (let i = 0; i < mapping.notes.length; i++) {
        const note = mapping.notes[i]

        if (i > 0) {
            const index = notes.indexOf(note)
            const previousIndex = notes.indexOf(mapping.notes[i - 1])

            if (index < previousIndex) {
                octave += 1
            }
        }

        out.push(setOctave(note, octave as Octave))
    }

    return out
}

export function packChord(notes: Note[]) {
    const mapping = chordMappings.find(
        mapping => arraysEqual(notes, mapping.notes)
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

type PatternItemBase = {
    start: number,
    length: number
}

export type PatternNoteItem = {
    type: "note",
    note: Note | NoteOctave
} & PatternItemBase

export type PatternChordItem = {
    type: "chord",
    chord: Chord
} & PatternItemBase

export type PatternItem = PatternNoteItem | PatternChordItem

export function getPatternLength(items: PatternItem[]) {
    return items.reduce(
        (acc, item) => Math.max(acc, item.start + item.length), 0
    )
}

export function unpackPattern(items: PatternItem[]) {
    const out: PatternNoteItem[] = []

    for (const item of items) {
        if (item.type === "note") {
            out.push(item)
        } else if (item.type === "chord") {
            unpackChord(item.chord)!.forEach(note => out.push({
                type: "note",
                start: item.start,
                length: item.length,
                note
            }))
        }
    }

    return out
}

export function getPatternOctaveSpan(items: PatternNoteItem[]) {
    let min = 9, max = 0

    for (const item of items) {
        const octave = getOctave(item.note)

        min = Math.min(min, octave)
        max = Math.max(max, octave)
    }

    return {min, max}
}

export type NoteGroups = {
    [key in Note]: PatternNoteItem[]
}

export function groupNotes(items: PatternNoteItem[]): NoteGroups {
    const groups: any = {}
    
    for (const note of notes) {
        groups[note] = items.filter(item => getNote(item.note) === note)
    }

    return groups as NoteGroups
}

export type NoteOctaveGroups = {
    [key in NoteOctave]: PatternNoteItem[]
}

export function groupNoteOctaves(items: PatternNoteItem[]): NoteOctaveGroups {
    const groups: any = {}
    const octaveSpan = getPatternOctaveSpan(items)
    
    for (let oct = octaveSpan.min; oct <= octaveSpan.max; oct++) {
        for (const note of notes) {
            const noteoct = setOctave(note, oct as Octave)

            groups[noteoct] = items.filter(item => item.note === noteoct)
        }
    }

    return groups as NoteOctaveGroups
}