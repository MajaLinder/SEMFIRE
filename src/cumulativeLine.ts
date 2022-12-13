import * as d3 from "d3";
import { Bar, CumulativeLine, Pareto } from "./pareto";
import { moduleCategoryAxis, moduleIndices, modulePercentageAxis } from "./axis";
import { resources } from "./resources";
import { rectangularSelection } from "./rectangleMarking";
import { Settings } from "./settings";
import { Line } from "d3";

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
    const markedStroke: string = "#3050EF";
    const unMarkedStroke: string = "#d5dcfb";

    // if nothing is marked in the chart then no opacity is applied
    d3svg.selectAll(".line").remove();
    d3svg.selectAll(".line-circle").remove();
    d3svg.selectAll(".dots-group").remove();

    // filter data to have marked and unmarked separetly in two lines. This is not dependent on the bars'
    //TODO: Change this to be based on marking instead

    if (pareto.noMarkOnLine == true) {
        // no marking yet only need to render as is
        var line = d3
            .line<any>()
            .x(function (d): number {
                return categoryAxis(d.index)!;
            })
            .y(function (d): number {
                return valueAxis(d.percentage)!;
            });

        drawLine(pareto.cumulativeLine, markedStroke, line);
        drawDots(pareto.cumulativeLine, markedStroke);
    } else {
        // there is marking to render
        const markedPostions = pareto.cumulativeLine.filter((line) => line.isMarked == true);
        const unMarkedPositions = pareto.cumulativeLine.filter((line) => line.isMarked == false);

        var unMarkedline = d3
            .line<any>()
            .x(function (d): number {
                return categoryAxis(d.index)!;
            })
            .y(function (d): number {
                return valueAxis(d.percentage)!;
            });

        var markedline = d3
            .line<any>()
            .x(function (d): number {
                return categoryAxis(d.index)!;
            })
            .y(function (d): number {
                return valueAxis(d.percentage)!;
            })
            .defined((d) => d.isMarked == true);

        drawLine(pareto.cumulativeLine, unMarkedStroke, unMarkedline);
        drawLine(pareto.cumulativeLine, markedStroke, markedline);

        drawDots(unMarkedPositions, unMarkedStroke);
        drawDots(markedPostions, markedStroke);
    }

    //rectangularLineSelection(".line-circle");

    function drawLine(lineData: CumulativeLine[], stroke: string, line: Line<any>) {
        d3svg
            .append("path")
            .datum(lineData)
            .attr("class", "line")
            .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", stroke)
            .style("stroke-width", "2")
            .on("click", function (event: any, d: any) {
                // set as marked
                // d.isMarked = true;
                console.log(d);
                // console.log("onClick");
            });
        // TODO: add hovering functionality similar to bar.
    }

    function drawDots(lineData: CumulativeLine[], stroke: string) {
        d3svg
            .append("g")
            .attr("class", "dots-group")
            .selectAll("dot")
            .data(lineData)
            .enter()
            .append("circle")
            .classed("line-circle", true)
            .attr("cx", function (d): any {
                return categoryAxis(d.index as any);
            })
            .attr("cy", function (d): any {
                return valueAxis(d.percentage);
            })
            .attr("r", 5)
            .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")")
            .style("fill", stroke)
            .on("click", function (event: any, d: any) {
                console.log(d);
                //d.mark();
                d.isMarked = true;
                pareto.noMarkOnLine = false;
                //renderCumulativeLine(pareto, settings);
            });
    }
}
