import * as d3 from "d3";
import {Pareto} from "./pareto";

/**
 * Render the bars using d3
 * @param pareto Pareto data structure
 */
 export function renderStackedBars(pareto: Pareto) {

    const stackedBars = pareto.stackedBars;
    
    const margin = {"top": 20, "left": 20, "right": 20, "bottom": 20};

    // select the svg
    let svg = d3.select("svg");

    //Get width and height from svg. cast to Number 
    const width = Number(svg.style("width").replace("px", ""));
    const height = Number(svg.style("height").replace("px", ""));

    const usableWidth = width - margin.left - margin.right;
    const usableHeight = height - margin.top - margin.bottom;

    let categoryScale = d3.scaleLinear()
        .domain([0, stackedBars.length])
        .range([margin.left, usableWidth - margin.right]);

    let valueScale = d3.scaleLinear()
        .domain([0, d3.max(stackedBars, d => d.totalValue) as Number])
        .range([usableHeight - margin.bottom, margin.top]);

    const groups = svg.selectAll('.bar')
        .data(stackedBars)
        .join(enter => {
            const groups = enter.append('g').attr('class', 'bar');

            groups
                .append('rect')
                .attr('height', 0)
                .attr('y', usableHeight);

            return groups;
    
        });

    groups.attr('transform', (_, i) => `translate(${categoryScale(i)}, 0)`);

    let barWidth = usableWidth / stackedBars.length;
    let barPadding = Math.ceil(50 / stackedBars.length);

    groups.select('rect')
        // TODO: use color from pareto/settings
        .attr('fill', "steelblue")
        .attr('width', barWidth - barPadding * 2)
        .attr('height', d => usableHeight - Number(valueScale(d.totalValue)))
        .attr('x', barPadding)
        .attr('y', d => Number(valueScale(d.totalValue)));
}