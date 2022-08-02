import { StructureBlock } from "../structure/types";
import { createLayerBlocks } from "./layers";
import { createPointTargets } from "./points";

export function conductStructure(structure: StructureBlock[]) {
    return createLayerBlocks(createPointTargets(structure))
}