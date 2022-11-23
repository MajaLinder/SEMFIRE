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
    const svg:SVGElement = document.querySelector("#svg")!;
    const svgBoundingClientRect:SVGRect = svg.getBoundingClientRect();
    const categoryAxis= moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue,svgBoundingClientRect.height,ticks);
   
    var d3svg = d3.select("svg");
    let g =d3svg.select("g")

    g.selectAll(".bar")
         .data(pareto.stackedBars)
         .enter().append("rect")
         .attr("fill", "pink")
         .attr("class", "bar")
         .attr("x", function(d):number { return categoryAxis(d.label)!; })
         .attr("y", function(d):number { return valueAxis(d.totalValue)!; })
         .attr("width", categoryAxis.bandwidth())
         .attr("height", function(d) { return ((svgBoundingClientRect.height -50) - Number (valueAxis (d.totalValue))) });

}