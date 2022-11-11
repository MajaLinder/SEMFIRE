import * as d3 from "d3";
import { NumberValue } from "d3";
import {Pareto, StackedBar, Bar } from "./pareto";

export interface Settings {
    //here you define all settings that have an effect on how the pareto chart will be rendered and look like, 
    //for example: tick stroke width, tick length, etc
}

/**
 * Draws pareto with the given settings
 * @param pareto - Pareto to write in console
 * @param settings - Settings that should be used
 */
export async function renderPareto(pareto: Pareto, settings: Settings) {
    
    renderStackedBars(pareto, settings);
}

/**
 * Writes a textual representation of the pareto in debugging console
 * @param pareto - Pareto to write in console
 * @param settings - Settings that should be used
 */
export async function renderParetoAsTextInConsole(pareto: Pareto, settings: Settings) {
    pareto.stackedBars.forEach((p) => {
        console.log(p.label + " - " + p.totalValue + " (" + p.cumulativePercentage.toFixed(2)+ "%)");
    });

    console.log("Max value: " + pareto.maxValue);
    console.log("Min value: " + pareto.minValue);
}

/**
 * Render the bars using d3
 * @param pareto 
 * @param settings 
 */
function renderStackedBars(pareto: Pareto, settings: Settings) {

    // Maybe we should move this function to another file? 
    const stackedBars = pareto.stackedBars;
    
    // TODO: Add some Margins and padding
    const margin = {"top": 20, "left": 20, "right": 20, "bottom": 20};

    // select the svg
    let svg = d3.select("svg");

    //Get width and height from svg. cast to Number 
    const width = Number(svg.style("width").replace("px", ""));
    const height = Number(svg.style("height").replace("px", ""));

    const usableWidth = width - margin.left - margin.right;
    const usableHeight = height - margin.top - margin.bottom;
    // TODO: Add margin and padding  
    // scales are the same as before
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
                .attr('value', usableHeight);

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
        .attr('category', barPadding)
        .attr('value', d => Number(valueScale(d.totalValue)));
}