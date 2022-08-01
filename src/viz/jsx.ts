type VizElement = string | string[] | ((props: any) => (string | string[]))

const singleTagElements = ["img", "br", "hr"]

export function createVizElement(element: VizElement, props: any, ...children: any[]) {
    if (typeof element === "string") {
        const propString = Object.keys(props ?? {}).map(
            key => ` ${key}="${props[key]}"`
        ).join("")

        if (singleTagElements.includes(element)) {
            return `<${element}${propString}/>`
        } else {
            return `<${element}${propString}>${children.flat().join("")}</${element}>`
        }
    } else if (element instanceof Function) {
        return element.call(null, {...props, children: children.flat()})
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [key: string]: any
        }
    }
}