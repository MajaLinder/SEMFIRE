import * as d3 from "d3";
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

    pareto.stackedBars.forEach(stackedBar => {
        positions.push([stackedBar.position * (100 / pareto.stackedBars.length), stackedBar.cumulativePercentage]);
        
    });

    let svg = d3.select("svg")
    let svgContainer = document.querySelector("#svg");
    
    const width = svgContainer?.getBoundingClientRect().width as number;
    const height = svgContainer?.getBoundingClientRect().height as number;
    

    var categoryScale:any = d3.scaleLinear().domain([0, 100]).range([0, width]),
        valueScale:any = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    var line = d3.line<any>()
        .x(function (d) { return categoryScale(d[0]); })
        .y(function (d) { return valueScale(d[1]); })

    svg.append("path")
        .datum(positions)
        .attr("class", "line")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2")
}