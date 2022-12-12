import * as d3 from "d3";
import { Bar, Pareto } from "./pareto";
import { moduleCategoryAxis, moduleIndices, modulePercentageAxis } from "./axis";
import { resources } from "./resources";
import { rectangularSelection } from "./rectangleMarking";
import { Settings } from "./settings";

/**
 * Render the cumulative line using d3
 * @param pareto Pareto data structure
 */
export function renderCumulativeLine(pareto: Pareto, settings: Settings) {
    const paretoCategoryIndices: number[] = moduleIndices(pareto);

    let d3svg = d3.select("svg");
    const svg: SVGElement = document.querySelector("#svg")!;
    const svgBoundingClientRect: SVGRect = svg.getBoundingClientRect();
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
        .x(function (d): number {
            return categoryAxis(d[0])!;
        })
        .y(function (d): number {
            return valueAxis(d[1])!;
        });
    d3svg
        .append("g")
        .selectAll("dot")
        .data(pareto.stackedBars)
        .enter()
        .append("circle")
        .classed("line-circle", true)
        .attr("cx", function (d): any {
            return categoryAxis(d.index as any);
        })
        .attr("cy", function (d): any {
            return valueAxis(d.cumulativePercentage);
        })
        .attr("r", 5)
        .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")")
        .style("fill", "#3050EF")
        .style("opacity", (d) => (d.bars.find(isBarMarked) ? "1" : "0.5"))
        .style("stroke", (d) => (d.bars.find(isBarMarked) ? "black" : "none"));

    d3svg
        .append("path")
        .datum(positions)
        .attr("class", "line")
        .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#3050EF")
        .style("stroke-width", "2")
        .on("click", function (event: any, d: any) {
            console.log("onClick");
        });

    // rectangularSelection({
    //     clearMarking: settings.clearMarking,
    //     mark: (d: any) => d.mark(),
    //     markingSelector: ".line-Circle"
    // });
}

function isBarMarked(bar: Bar) {
    return bar.isMarked === true;
}
