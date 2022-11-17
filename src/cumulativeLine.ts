import * as d3 from "d3";
import {Pareto} from "./pareto";
import{moduleCategoryAxis,moduleCategories, modulePercentageAxis} from "./axis"

/**
 * Render the cumulative line using d3
 * @param pareto Pareto data structure
 */
export function renderCumulativeLine(pareto: Pareto) {

    // removes previously rendered line
    //d3.selectAll("path").remove();

    // store the x and y positions for the line
    let positions: any[][] = [];

    // store these to use later when setting the domain of the scale
    let cumulativePercentages: number[] = [];

    const paretoCategoryValues:string[] = moduleCategories(pareto)

    let svg = d3.select("svg")
    const svgBoundingClientRect:any = document.querySelector("#svg");
    const valueInPixels:any = svgBoundingClientRect.getBoundingClientRect();
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, valueInPixels.width);
    const valueAxis = modulePercentageAxis(valueInPixels.height);
    
    //const width = svgBoundingClientRect?.getBoundingClientRect().width as number;
    //const height = svgBoundingClientRect?.getBoundingClientRect().height as any;

    pareto.stackedBars.forEach(stackedBar => {
        //let stackedBarWidth = 1 / pareto.stackedBars.length;
        //segments' start position should be aligned with the center of their respective stacked bars (horizontally)
        //let xPosition = stackedBar.position * stackedBarWidth + stackedBarWidth/2; 
        //positions.push([xPosition, stackedBar.cumulativePercentage]);
        positions.push([stackedBar.label, stackedBar.cumulativePercentage]);

        cumulativePercentages.push(stackedBar.cumulativePercentage);
    });

    console.log(positions)

    //var categoryScale:any = d3.scaleLinear().domain([0, pareto.stackedBars.length]).range([0, width]),
       // valueScale:any = d3.scaleLinear().domain([0, cumulativePercentages[cumulativePercentages.length -1]]).range([height, 0]);

    var line = d3.line<any>()
        .x(function (d):any { return categoryAxis(d[0]); })
        .y(function (d):any { return valueAxis(d[1]); })

    svg.append("path")
        .datum(positions)
        .attr("class", "line")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#4916ea")
        .style("stroke-width", "2")
}