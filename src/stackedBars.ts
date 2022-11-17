import * as d3 from "d3";
import {Pareto} from "./pareto";

/**
 * Render the bars using d3
 * @param pareto Pareto data structure
 */
 export function renderStackedBars(pareto: Pareto) {

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