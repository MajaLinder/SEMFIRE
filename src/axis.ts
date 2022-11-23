import * as d3 from "d3";
import { Pareto} from "./pareto";

 export function renderAxes(pareto: Pareto) {
    d3.selectAll("path").remove();
    d3.selectAll("g").remove();

    const paretoCategoryValues:string[] = moduleCategories(pareto)

    let ticks=moduleTicks(pareto)
    var d3svg = d3.select("svg");
    const svg:any = document.querySelector("#svg");
    const svgBoundingClientRect:any = svg.getBoundingClientRect();

    var d3svg = d3.select("svg");
    const categoryAxis= moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue,svgBoundingClientRect.height,ticks);
    const percentageAxis =  modulePercentageAxis(svgBoundingClientRect.height)
   
    var g = d3svg
        .append("g") 
        .attr("transform", "translate(" + 65 + "," + 0 + ")");
  
    g.append("g")
        .attr("transform", "translate(0," + (svgBoundingClientRect.height - 50) + ")")
        .call(d3.axisBottom(categoryAxis).scale(categoryAxis))
        

    g.append("g").call(d3.axisLeft(valueAxis).ticks(ticks));
    g.append("g")
        .attr("transform", "translate(" + (svgBoundingClientRect.width - 100) + " ,0)")
        .call(d3.axisRight(percentageAxis).tickPadding(2).ticks(10)
        .tickFormat(function(d) {
          return d + "%";
        }));
}

const moduleCategoryAxis =(domain:any, rangeStart:number , rangeWidth:number)=>{

    let categoryAxis = d3
            .scaleBand()
            .domain(domain)           
            .range([rangeStart, rangeWidth - 100])
            .paddingInner(0.13)
            .paddingOuter(0.26)
    return categoryAxis;

}
const moduleValueAxis = (domain:any,rangeHeight:number,ticks:number)=>{
    let valueAxis = d3
            .scaleLinear()
            .domain([0, domain]).nice(ticks)
            .range([rangeHeight - 50, 100])
        return valueAxis;
}
const modulePercentageAxis = (rangeHeight: number)=>{
   let percentageAxis = d3
    .scaleLinear()
    .domain([0 , 100 ])
    .range([rangeHeight - 50, 100]);
    return percentageAxis;
}
const moduleCategories = (pareto: Pareto)=>{
    const paretoCategoryValues:string[] = [];
    pareto.stackedBars.forEach((p) => {
        paretoCategoryValues.push(p.label);
    });
    return paretoCategoryValues;
}
const moduleTicks = (pareto: Pareto)=>{
    let ticks:number = 0;
    if(pareto.maxValue <= 50){
        ticks = 5;
    }else if (pareto.maxValue >50 && pareto.maxValue <= 100){
        ticks= 10;
    }else {
        ticks= 20;
    }
    return ticks;
}
export {moduleCategoryAxis,modulePercentageAxis,moduleValueAxis, moduleTicks,moduleCategories};