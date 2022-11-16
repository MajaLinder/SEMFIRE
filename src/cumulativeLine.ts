import * as d3 from "d3";
import { stack } from "d3";
import {Pareto} from "./pareto";



/**
 * Render the cumulative line using d3
 * @param pareto Pareto data structure
 */
export function renderCumulativeLine(pareto: Pareto) {

    // removes previously rendered line
    d3.selectAll("path").remove();

    // store the x and y positions for the line
    let positions: number[][] = [];

    // store these to use later when setting the domain of the scale
    let categoryPositions: number[] = [];
    let cumulativePercentages: number[] = [];

    let svg = d3.select("svg")
    let svgContainer = document.querySelector("#svg");
    
    const width = svgContainer?.getBoundingClientRect().width as number;
    const height = svgContainer?.getBoundingClientRect().height as number;

    pareto.stackedBars.forEach(stackedBar => {
        let stackedBarWidth = 1 / pareto.stackedBars.length;
        //segments' start position should be aligned with the center of their respective stacked bars (horizontally)
        let xPosition = stackedBar.position * stackedBarWidth + stackedBarWidth/2; 
        positions.push([xPosition, stackedBar.cumulativePercentage]);

        categoryPositions.push(stackedBar.position * (stackedBarWidth));
        cumulativePercentages.push(stackedBar.cumulativePercentage);
    });

    var categoryScale:any = d3.scaleLinear().domain([0, 1]).range([0, width]),
        valueScale:any = d3.scaleLinear().domain([0, cumulativePercentages[cumulativePercentages.length -1]]).range([height, 0]);

    var line = d3.line<any>()
        .x(function (d) { return categoryScale(d[0]); })
        .y(function (d) { return valueScale(d[1]); })

    svg.append("path")
        .datum(positions)
        .attr("class", "line")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#4916ea")
        .style("stroke-width", "2")
}