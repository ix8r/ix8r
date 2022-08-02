import { Arrangement, ArrangementSection } from "../../arranger"
import { availableLayers, ConductorLayer, ConductorLayerType } from "../../arranger/conductor/layers"
import { createVizElement } from "../jsx"

export function ArrangementRollTimeline(props: {
    length: number
}) {
    return Array(props.length).fill(0).map(
        (_, i) => <th>{i}</th>
    )
}

export function ArrangementRollSectionline(props: {
    sections: ArrangementSection[]
}) {
    return props.sections.map(
        section => <th colspan={section.length}>{section.name}</th>
    )
}

export function ArrangementRollLayer(props: {
    name: ConductorLayerType,
    items: (ConductorLayer | null)[]
}) {
    return <tr>
        <td>{props.name}</td>
        {
            props.items.map(
                item => <td class={item ? `pattern pattern-${item.complexity}` : ""}>
                    {item ? item.complexity : ""}
                </td>
            )
        }
    </tr>
}

export function ArrangementRoll(props: {
    arrangement: Arrangement
}) {
    return <table class="arrangement">
        <thead>
            <tr>
                <th></th>
                <ArrangementRollTimeline length={props.arrangement.length} />
            </tr>
            <tr>
                <th></th>
                <ArrangementRollSectionline sections={props.arrangement.sections} />
            </tr>
        </thead>
        <tbody> 
            {
                availableLayers.map(
                    type => <ArrangementRollLayer name={type} items={props.arrangement.layers[type]} />
                )
            }
        </tbody>
    </table>
}