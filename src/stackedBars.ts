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

    const stackedBars = pareto.stackedBars;

    // select the svg
    let svg = d3.select("svg");
    let svgContainer = document.querySelector("#svg");
    
    //Get width and height from svg. cast to Number 
    const width = svgContainer?.getBoundingClientRect().width as number;
    const height = svgContainer?.getBoundingClientRect().height as number;

    let categoryScale = d3.scaleLinear()
        .domain([0, stackedBars.length])
        .range([0, width]);

    let valueScale = d3.scaleLinear()
        .domain([0, d3.max(stackedBars, d => d.totalValue) as Number])
        .range([height, 0]);

    const groups = svg.selectAll('.bar')
        .data(stackedBars)
        .join(enter => {
            const groups = enter.append('g').attr('class', 'bar');

            groups
                .append('rect')
                .attr('height', 0)
                .attr('y', height);

            return groups;
    
        });

    groups.attr('transform', (_, i) => `translate(${categoryScale(i)}, 0)`);

    let barWidth = width / stackedBars.length;
    let barPadding = Math.ceil(50 / stackedBars.length);

    groups.select('rect')
        // TODO: use color from pareto/settings
        .attr('fill', "steelblue")
        .attr('width', barWidth - barPadding * 2)
        .attr('height', d => height - Number(valueScale(d.totalValue)))
        .attr('x', barPadding)
        .attr('y', d => Number(valueScale(d.totalValue)));
}