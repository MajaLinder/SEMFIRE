import * as d3 from "d3";
import { Pareto} from "./pareto";

 export async function renderAxes(pareto: Pareto) {
    d3.selectAll("path").remove();
    d3.selectAll("g").remove();

    const paretoCategoryValues:any = [];
    pareto.stackedBars.forEach((p) => {
        paretoCategoryValues.push(p.label);
    });

    let ticks:number = 0;
    if(pareto.maxValue <= 50){
        ticks = 5;
    }else if (pareto.maxValue >50 && pareto.maxValue <= 100){
        ticks= 10;
    }else {
        ticks= 20;
    }
    var svg = d3.select("svg");
    const svgBoundingClientRect:any = document.querySelector("#svg");
    const valueInPixels:any = svgBoundingClientRect.getBoundingClientRect();


    var svg = d3.select("svg");

    var categoryAxis = d3
            .scaleBand()
            .domain(paretoCategoryValues)           
            .range([0, valueInPixels.width - 100]),
        valueAxis = d3
            .scaleLinear()
            .domain([0, pareto.maxValue]).nice(ticks)
            .range([valueInPixels.height - 50, 100])
            ,
        percentageAxis = d3
            .scaleLinear()
            .domain([0 , 100 ])
            .range([valueInPixels.height - 50, 100]);
     
    var g = svg
        .append("g") 
        .attr("transform", "translate(" + 65 + "," + 0 + ")");
  
    g.append("g")
        .attr("transform", "translate(0," + (valueInPixels.height - 50) + ")")
        .call(d3.axisBottom(categoryAxis).scale(categoryAxis).tickSize(0).tickPadding(3))
        

    g.append("g").call(d3.axisLeft(valueAxis).ticks(ticks));
    g.append("g")
        .attr("transform", "translate(" + (valueInPixels.width - 100) + " ,0)")
        .call(d3.axisRight(percentageAxis).tickPadding(2).ticks(10)
        .tickFormat(function(d) {
          return d + "%";
        }));
        
}