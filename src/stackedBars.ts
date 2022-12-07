import * as d3 from "d3";
import { Pareto } from "./pareto";
import { Settings } from "./settings";
import { moduleCategoryAxis, moduleValueAxis, moduleTicks, moduleCategories } from "./axis";
import { resources } from "./resources";
/**
 * Render the bars using d3
 * @param pareto Pareto data structure
 * @param settings Settings that should be used
 */

export function renderStackedBars(pareto: Pareto, settings: Settings) {
    const paretoCategoryValues: string[] = moduleCategories(pareto);
    const svg: SVGElement = document.querySelector("#svg") as SVGElement;
    const svgBoundingClientRect: DOMRect = svg.getBoundingClientRect();
    const ticks = moduleTicks(svgBoundingClientRect.height, settings.style.label.size);
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue, svgBoundingClientRect.height, ticks);

    // Create a group for each series
    var sel = d3
        .select("#svg")
        .select("g")
        .selectAll("g.series")
        .data(pareto.stackedBars)
        .join("g")
        .classed("series", true)
        .attr("id", (d) => d.key);

    //For each series, create a rectangle for each color key
    var inBars = sel
        .selectAll("rect")
        .data((d) => d.bars)
        .join("rect")
        .classed("in-bar", true)
        .attr("y", (d) => (valueAxis(d.y0 + d.value) ?? 0) + settings.style.inbarsSeparatorWidth)
        .attr("x", (d) => categoryAxis(d.parentKey) ?? 0)
        .attr("height", (d) =>
            Math.max(
                Math.abs((valueAxis(d.y0) ?? 0) - (valueAxis(d.y0 + d.value) ?? 0)) -
                    settings.style.inbarsSeparatorWidth,
                1
            )
        )
        .attr("width", categoryAxis.bandwidth())
        .style("fill", (d) => d.color)
        .attr("stroke", (d) => (d.isMarked ? "#000" : "none"))
        .attr("stroke-width", (d) => (d.isMarked ? settings.style.selectionBox.strokeWidth : "0"));

    //add an a
    inBars
        .on("click", function (event: any, d: any) {
            d.mark(event);
        })
        .on("mouseover", function (event: any, d: any) {
            const nodes = inBars.nodes();
            const i = nodes.indexOf(this);
            let thisRect = nodes[i] as SVGAElement;
            let parentGroup = d3.select(thisRect.parentElement);
            addSelectionBox(parentGroup, thisRect, "inbar-hover-border", settings);
        })
        .on("mouseleave", function (event: any, d: any) {
            d3.select(".inbar-hover-border").remove();
        });

    function addSelectionBox(selection: any, baseRectangle: SVGAElement, cssClass: string, settings: Settings) {
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
}
