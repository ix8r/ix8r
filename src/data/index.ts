import { existsSync, readFileSync } from "fs";
import { join, parse } from "path";
import { handleBuffer } from "./handlers";

const dataBasePath = join(__dirname, "../../data")

const cachedData = new Map<string, any>()

export default function getData(path: string) {
    const filePath = join(dataBasePath, path)

    if (cachedData.has(filePath)) {
        return cachedData.get(filePath)
    }

    if (!existsSync(filePath)) {
        return null
    }

    const buffer = readFileSync(filePath)
    const extension = parse(filePath).ext.toLowerCase()

    const data = handleBuffer(buffer, extension)
    cachedData.set(filePath, data)

    return data
}