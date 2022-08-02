import { getPatternLength, groupNoteOctaves, groupNotes, Note, NoteOctave, PatternNoteItem } from "../../notes"
import { notes } from "../../notes/lookup"
import { createVizElement } from "../jsx"

export function PianoRollTimeline(props: {
    length: number
}) {
    return Array(props.length / 4).fill(0).map(
        (_, i) => <th colspan={4}>{Math.floor(i / 4)}:{i % 4}</th>
    )
}

export function PianoRollNoteGroup(props: {
    note: NoteOctave,
    length: number,
    items: PatternNoteItem[]
}) {
    const spans: (number | null)[] = Array(props.length).fill(0)

    for (const item of props.items) {
        for (let i = 0; i < item.length; i++) {
            spans[item.start + i] = i ? null : item.length
        }
    }

    return <tr>
        <td>{props.note}</td>
        {
            spans.filter(item => item !== null).map(
                span => <td colspan={span!} class={span ? "note" : ""}></td>
            )
        }
    </tr>
}

export function PianoRoll(props: {
    pattern: PatternNoteItem[]
}) {
    const length = Math.max(
        4, Math.ceil(getPatternLength(props.pattern) / 4) * 4
    )
    const groups = groupNoteOctaves(props.pattern)

    return <table class="piano-roll">
        <thead>
            <tr>
                <th></th>
                <PianoRollTimeline length={length} />
            </tr>
        </thead>
        <tbody>
            {
                Object.keys(groups).reverse().map(
                    noteoct => <PianoRollNoteGroup
                        note={noteoct as NoteOctave} length={length}
                        items={groups[noteoct as NoteOctave]}
                    />
                )
            }
        </tbody>
    </table>
}