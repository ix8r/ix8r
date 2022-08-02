import { conductStructure } from "./conductor"
import { ConductorLayer, ConductorLayerType } from "./conductor/layers"
import { processTemplate } from "./structure"
import { StructureFile } from "./structure/types"

export type ArrangementSection = {
    name: string,
    length: number
}

export type ArrangementLayers = {
    [key in ConductorLayerType]: (ConductorLayer | null)[]
}

export type Arrangement = {
    length: number,
    sections: ArrangementSection[],
    layers: ArrangementLayers
}

export function createArrangement(template: StructureFile) {
    const blocks = conductStructure(processTemplate(template))

    const length = blocks.length

    const sections: ArrangementSection[] = []
    const layers: ArrangementLayers = {
        arps: [],
        bass: [],
        chords: [],
        drums: [],
        pads: []
    }

    for (const block of blocks) {
        if (sections.length === 0 || sections[sections.length - 1].name !== block.name) {
            sections.push({
                name: block.name,
                length: 1
            })
        } else {
            sections[sections.length - 1].length += 1
        }
        
        for (const type of Object.keys(layers) as ConductorLayerType[]) {
            const conductorLayer = block.layers.find(layer => layer.name === type)
            
            layers[type].push(conductorLayer ?? null)
        }
    }

    return { length, sections, layers }
}