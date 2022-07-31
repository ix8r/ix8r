import getData from "./data"
import { defineEntry, enter } from "./util/entry"

defineEntry("test", (argv) => {
    console.log(getData("test/file.json"))
})

export default function ix8r(entry: string, argv: any) {
    enter(entry, argv)
}