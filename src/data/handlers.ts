import { parseMidi } from "midi-file"

export function handleBuffer(buffer: Buffer, extension: string) {
    switch (extension) {
        case ".json":
            return JSON.parse(buffer.toString("utf-8"))
        case ".mid":
        case ".midi":
            return parseMidi(buffer)
    }

    return buffer
}