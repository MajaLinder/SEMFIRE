import * as d3 from "d3";
import { Pareto} from "./pareto";

 export async function drawLine(pareto: Pareto) {
    d3.selectAll("path").remove();
    d3.selectAll("g").remove();

    const maxValueHeight:number = pareto.maxValue;
    const maxValueWidth:any = [];
    pareto.stackedBars.forEach((p) => {
        maxValueWidth.push(p.label);
    });
  
    var svg = d3.select("svg");
    const valueAxisHeight:any = document.querySelector("#svg");
    const valuePixels:any = valueAxisHeight.getBoundingClientRect();
    const categoryAxisWidth:any = document.querySelector("#svg");
    const categoryPixels:any = categoryAxisWidth.getBoundingClientRect();
    console.log(categoryPixels.width);
    console.log(valuePixels.height);
    var svg = d3.select("svg");
// Step 4
    var xScale = d3
            .scaleBand()
            .domain(maxValueWidth)
            .range([0, categoryPixels.width - 50]),
        yScale = d3
            .scaleLinear()
            .domain([0, maxValueHeight])
            .range([valuePixels.height - 50, 3]),
        zScale = d3
            .scaleLinear()
            .domain([0, 100])
            .range([valuePixels.height - 50, 3]);

    var g = svg
        .append("g") //move bars
        .attr("transform", "translate(" + 20 + "," + 0 + ")");
    // Step 6
    g.append("g")
        .attr("transform", "translate(0," + (valuePixels.height - 50) + ")")
        .call(d3.axisBottom(xScale));

    g.append("g").call(d3.axisLeft(yScale));
    g.append("g")
        .attr("transform", "translate(" + (categoryPixels.width - 50) + " ,0)")
        .call(d3.axisRight(zScale));
}