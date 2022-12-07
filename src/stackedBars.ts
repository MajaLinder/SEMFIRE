import * as d3 from "d3";
import { Pareto } from "./pareto";
import { Settings } from "./settings";
import { moduleCategoryAxis, moduleValueAxis, moduleTicks, moduleCategories } from "./axis";

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
        .classed("series", true);

    //For each series, create a rectangle for each color key
    sel.selectAll("rect")
        .data((d) => d.bars)
        .join("rect")
        .classed("in-bar", true)
        .attr("y", (d) => valueAxis(d.y0 + d.value) ?? 0)
        .attr("x", (d) => categoryAxis(d.parentKey) ?? 0)
        .attr("height", (d) => Math.abs((valueAxis(d.y0) ?? 0) - (valueAxis(d.y0 + d.value) ?? 0)))
        .attr("width", categoryAxis.bandwidth())
        .style("fill", (d) => d.color)
        .on("click", function (d) {
            if (d3.event.ctrlKey) {
                d.mark("ToggleOrAdd");
            } else {
                d.mark();
            }
        });
}
