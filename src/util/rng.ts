import seedrandom from "seedrandom"

let rng = seedrandom()

export function nextRng() {
    return rng()
}

export function setSeed(seed: string) {
    rng = seedrandom(seed)
}