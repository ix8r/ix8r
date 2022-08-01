import { getPatternItemAt, getPatternLength, PatternItem } from ".";

export function simplify<T extends PatternItem>(items: T[], unit: number) {
    const length = getPatternLength(items)
    const steps = Math.ceil(length / unit)

    return Array(steps).fill(0).map(
        (_, i) => {
            const time = unit * i

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
