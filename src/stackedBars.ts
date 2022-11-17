import * as d3 from "d3";
import {Pareto} from "./pareto";
import{moduleCategoryAxis,moduleValueAxis, moduleTicks,moduleCategories} from "./axis"
/**
 * Render the bars using d3
 * @param pareto Pareto data structure
 */
 export function renderStackedBars(pareto: Pareto) {
   
    const paretoCategoryValues:string[] = moduleCategories(pareto)

    let ticks=moduleTicks(pareto)
    const svgBoundingClientRect:any = document.querySelector("#svg");
    const valueInPixels:any = svgBoundingClientRect.getBoundingClientRect();
    const categoryAxis= moduleCategoryAxis(paretoCategoryValues,valueInPixels.width);
    const valueAxis = moduleValueAxis(pareto.maxValue,valueInPixels.height,ticks);
   
    var svg = d3.select("svg");
    let g =svg.select("g")

    g.selectAll(".bar")
         .data(pareto.stackedBars)
         .enter().append("rect")
         .attr("fill", "pink")
         .attr("class", "bar")
         .attr("x", function(d):any { return categoryAxis(d.label); })
         .attr("y", function(d):any { return valueAxis(d.totalValue); })
         .attr("width", categoryAxis.bandwidth())
         .attr("height", function(d) { return ((valueInPixels.height -50) - Number (valueAxis (d.totalValue))) });

}