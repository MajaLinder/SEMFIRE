import * as d3 from "d3";
import { Pareto } from "./pareto";
import { moduleCategoryAxis, moduleIndices, modulePercentageAxis } from "./axis";

/**
 * Render the cumulative line using d3
 * @param pareto Pareto data structure
 */
export function renderCumulativeLine(pareto: Pareto) {
    const paretoCategoryIndices: number[] = moduleIndices(pareto);

    let d3svg = d3.select("svg");
    const svg: any = document.querySelector("#svg");
    const svgBoundingClientRect: any = svg.getBoundingClientRect();
    const categoryAxisBandwidth = moduleCategoryAxis(paretoCategoryIndices, 0, svgBoundingClientRect.width); //used to get bandwidth later
    const categoryAxis = moduleCategoryAxis(
        paretoCategoryIndices,
        categoryAxisBandwidth.bandwidth() / 2,
        svgBoundingClientRect.width + categoryAxisBandwidth.bandwidth() / 2
    );
    const valueAxis = modulePercentageAxis(svgBoundingClientRect.height);

    const positions = pareto.stackedBars.map((stackedBar) => {
        return [stackedBar.index, stackedBar.cumulativePercentage];
    });

    var line = d3
        .line<any>()
        .x(function (d): any {
            return categoryAxis(d[0]);
        })
        .y(function (d): any {
            return valueAxis(d[1]);
        });

    d3svg
        .append("path")
        .datum(positions)
        .attr("class", "line")
        .attr("transform", "translate(" + 40 + "," + 0 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#4916ea")
        .style("stroke-width", "2");
}
