export function arraysEqual<T>(a1: T[], a2: T[]) {
    if (a1.length !== a2.length) {
        return false
    }

    return a1.reduce((acc, x, i) => acc + (x === a2[i] ? 1 : 0), 0) === a1.length
}

export function countIntersections<T>(a1: T[], a2: T[]) {
    let count = 0

    for (const item of a1) {
        count += a2.includes(item) ? 1 : 0
    }

    return count
}