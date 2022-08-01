import { getPatternItemAt, getPatternLength, NoteOctave, PatternItem, PatternNoteItem, shiftOctave, unpackChord } from ".";
import { lerp } from "../util/math";

export function simplify<T extends PatternItem>(items: T[], unit: number) {
    const length = getPatternLength(items)
    const steps = Math.ceil(length / unit)

    return Array(steps).fill(0).map(
        (_, i) => {
            const time: number = unit * i

            return {
                ...getPatternItemAt(items, time),
                start: time,
                length: Math.min(length - time, unit)
            }
        }
    ) as T[]
}

export function chop<T extends PatternItem>(items: T[], unit: number) {
    const length = getPatternLength(items)
    const starts = [
        ...items.map(item => item.start), length
    ]
    const newStarts: number[] = []
    
    for (let i = 0; i < starts.length - 1; i++) {
        for (let j = starts[i]; j < starts[i + 1];) {
            newStarts.push(j)

            j = Math.floor(j / unit + 1) * unit
        }
    }
    newStarts.push(length)

    const out: T[] = []

    for (let i = 0; i < newStarts.length - 1; i++) {
        out.push({
            ...getPatternItemAt(items, newStarts[i])!,
            start: newStarts[i],
            length: newStarts[i + 1] - newStarts[i]
        })
    }

    return out as T[]
}

export function articulate<T extends PatternItem>(items: T[], strength: number, quantize = false) {
    return items.map(
        item => {
            const length = item.length * lerp(Math.random(), 1 - strength, 1)
            
            return {
                ...item,
                length: quantize ? Math.round(length) : length
            }
        }
    ) as T[]
}

export type ArpeggiationMovement = "up" | "down" | "updown"

function getArpNote(notes: NoteOctave[], time: number, movement: ArpeggiationMovement) {
    let index = 0

    if (movement === "up") {
        index = time % notes.length
    } else if (movement === "down") {
        index = (notes.length - 1) - (time % notes.length)
    } else if (movement === "updown") {
        const modIndex = time % (2 * notes.length - 2)

        if (modIndex >= notes.length) {
            index = (notes.length - 1) - ((modIndex - notes.length + 1) % notes.length)
        } else {
            index = modIndex
        }
    }

    return notes[index]
}

function getArpPeriod(notes: NoteOctave[], movement: ArpeggiationMovement) {
    if (movement === "updown") {
        return 2 * notes.length - 2
    }

    return notes.length
}

export function arpeggiate<T extends PatternItem>(
    items: T[],
    unit: number, movement: ArpeggiationMovement, octaves = 1
): PatternNoteItem[] {
    return chop(items, unit).map(
        item => {
            const original = getPatternItemAt(items, item.start)!
            if (original.type === "note") {
                return item as PatternNoteItem
            }

            const arpTime = Math.ceil((item.start - original.start) / unit)

            const notes = unpackChord(original.chord)!
            const note = shiftOctave(
                getArpNote(notes, arpTime, movement),
                Math.floor(arpTime / getArpPeriod(notes, movement)) % octaves
            )

            return {
                type: "note",
                note,
                start: item.start,
                length: item.length
            } as PatternNoteItem
        }
    )
}

export function trim<T extends PatternItem>(items: T[], length: number) {
    const out: T[] = []

    for (const item of items) {
        if (item.start >= length) {
            continue
        }

        out.push({
            ...item,
            length: Math.min(length - item.start, item.length)
        })
    }

    return out
}

export function delay<T extends PatternItem>(items: T[], delay: number) {
    return items.map(item => ({
        ...item,
        start: item.start + delay
    })) as T[]
}

export function stutter<T extends PatternItem>(items: T[], unit: number) {
    const length = getPatternLength(items)
    const repeats = Math.ceil(length / unit)

    return Array(repeats).fill(0).map(
        (_, i) => {
            const time = unit * i

            return delay(
                trim(items, Math.min(length - time, unit)), time
            )
        }
    ).flat() as T[]
}
