import * as d3 from "d3";
import { Pareto, StackedBar } from "./pareto";
import { Settings } from "./settings";
import { moduleCategoryAxis, moduleValueAxis, moduleTicks, moduleCategories } from "./axis";

/**
 * Render the bars using d3
 * @param pareto Pareto data structure
 */

export function renderStackedBars(pareto: Pareto, settings: Settings) {
    const paretoCategoryValues: string[] = moduleCategories(pareto);

    const svg: SVGElement = document.querySelector("#svg")!;
    const svgBoundingClientRect: SVGRect = svg.getBoundingClientRect();
    const ticks = moduleTicks(svgBoundingClientRect.height, settings.style.label.size);
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue, svgBoundingClientRect.height, ticks);

    let colorKeys = pareto.colorIndices.map((x) => (x ?? 0).toString());
    var colorScale = d3.scaleOrdinal<string>().domain(colorKeys).range(pareto.colorRange);

    let stackGenerator = d3
        .stack<StackedBar>()
        .keys(colorKeys)
        .order(d3.stackOrderReverse)
        .value((stackedBar, key: string) => {
            let bar = stackedBar.bars.find((x) => x.index.toString() === key);
            return bar?.value ?? 0;
        });
    
    let stackedSeries = stackGenerator(pareto.stackedBars);
    
    // Create a group for each series
    var sel = d3
        .select("#svg")
        .select("g")
        .selectAll("g.series")
        .data(stackedSeries)
        .join("g")
        .classed("series", true)
        .style("fill", (d) => colorScale(d.key));

    //For each series, create a rectangle for each color key
    sel.selectAll("rect")
        .data((d) => d)
        .join("rect") 
        .attr("y", (d) => valueAxis(d[1]) ?? 0)
        .attr("x", (d) => categoryAxis(d.data.key) ?? 0)
        .attr("height", (d) => (valueAxis(d[0]) ?? 0) - (valueAxis(d[1]) ?? 0))
        .attr("width", categoryAxis.bandwidth());
}