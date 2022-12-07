import * as d3 from "d3";
import { Settings } from "./settings";
import { resources } from "./resources";

export function createRectangle(selection: any, baseRectangle: SVGAElement, cssClass: string, settings: Settings) {
    let boundingRect = baseRectangle.getBoundingClientRect();
    let padding = settings.style.onMouseOverBox.padding;
    selection
        .append("rect")
        .classed(cssClass, true)
        .attr("y", boundingRect.y - resources.PADDINGBOTTOMUP - padding)
        .attr("x", boundingRect.x - 70 - padding)
        .attr("height", boundingRect.height + 2 * padding)
        .attr("width", boundingRect.width + 2 * padding)
        .attr("stroke", "#000")
        .attr("stroke-width", settings.style.onMouseOverBox.strokeWidth)
        .attr("fill", "none");
}
