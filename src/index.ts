import { defineEntry, enter } from "./util/entry"

defineEntry("test", (argv) => console.log("Test!"))

export default function ix8r(entry: string, argv: any) {
    enter(entry, argv)
}