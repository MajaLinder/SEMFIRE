import * as d3 from "d3";
import {Pareto} from "./pareto";
import{moduleCategoryAxis,moduleCategories, modulePercentageAxis} from "./axis"

/**
 * Render the cumulative line using d3
 * @param pareto Pareto data structure
 */
export function renderCumulativeLine(pareto: Pareto) {

    // store the x and y positions for the line
    let positions: any[][] = [];

    // store these to use later when setting the domain of the scale
    let cumulativePercentages: number[] = [];

    const paretoCategoryValues:string[] = moduleCategories(pareto)

    let svg = d3.select("svg")
    const svgBoundingClientRect:any = document.querySelector("#svg");
    const valueInPixels:any = svgBoundingClientRect.getBoundingClientRect();
    let categoryAxisBandwidth = moduleCategoryAxis(paretoCategoryValues, 0, valueInPixels.width); //used to get bandwidth later
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, categoryAxisBandwidth.bandwidth()/2, valueInPixels.width + (categoryAxisBandwidth.bandwidth()/2));
    const valueAxis = modulePercentageAxis(valueInPixels.height);

    pareto.stackedBars.forEach(stackedBar => {
        positions.push([stackedBar.label, stackedBar.cumulativePercentage]);
        cumulativePercentages.push(stackedBar.cumulativePercentage);
    });

    console.log(categoryAxis.bandwidth()/2)

    var line = d3.line<any>()
        .x(function (d):any { return categoryAxis(d[0]); })
        .y(function (d):any { return valueAxis(d[1]); })

    svg.append("path")
        .datum(positions)
        .attr("class", "line")
        .attr("transform", "translate(" + 65 + "," + 0 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#4916ea")
        .style("stroke-width", "2")
}