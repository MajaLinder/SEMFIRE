import * as d3 from "d3";
import { Pareto } from "./pareto";
import { moduleCategoryAxis, moduleIndices, modulePercentageAxis } from "./axis";
import { resources } from "./resources";
import { Settings } from "./settings";
/**
 * Render the cumulative line using d3
 * @param pareto Pareto data structure
 */
export function renderCumulativeLine(pareto: Pareto, settings: Settings) {
    const paretoCategoryIndices: number[] = moduleIndices(pareto);

    let d3svg = d3.select("svg");
    const svg: SVGElement = document.querySelector("#svg")!;
    const svgBoundingClientRect: SVGRect = svg.getBoundingClientRect();
    const categoryAxisBandwidth = moduleCategoryAxis(paretoCategoryIndices, 0, svgBoundingClientRect.width); //used to get bandwidth later
    const categoryAxis = moduleCategoryAxis(
        paretoCategoryIndices,
        categoryAxisBandwidth.bandwidth() / 2,
        svgBoundingClientRect.width + categoryAxisBandwidth.bandwidth() / 2
    );
    const valueAxis = modulePercentageAxis(svgBoundingClientRect.height);

    const positions = pareto.stackedBars.map((stackedBar) => {
        return [stackedBar.index, stackedBar.cumulativePercentage];
    });

    const lineWeight = 3;

    var line = d3
        .line<any>()
        .x(function (d): number {
            return categoryAxis(d[0])!;
        })
        .y(function (d): number {
            return valueAxis(d[1])!;
        });

    d3svg
        .append("path")
        .datum(positions)
        .attr("class", "line")
        .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#3050EF")
        .style("stroke-width", lineWeight);
    d3svg
        .append("g")
        .selectAll("dot")
        .data(positions)
        .enter()
        .append("circle")
        .attr("cx", function (d): any {
            return categoryAxis(d[0] as any);
        })
        .attr("cy", function (d): any {
            return valueAxis(d[1]);
        })
        .attr("r", 5)
        .attr("transform", "translate(" + resources.PADDINGLEFT + "," +  resources.PADDINGBOTTOMDOWN + ")")
        .style("fill", "#3050EF")
        .on("mouseover", function (event:any, d: any) {
            showLineToolTip(d);
        })
        .on("mouseout", function () {
            settings.tooltip.hide();
        }); 
        // const si =  svgBoundingClientRect.width - (resources.PADDINGRIGHT - resources.PADDINGLEFT)
        // d3svg.append("line")
        // .style("stroke", "red")
        // .style("stroke-dasharray", "8 8")
        // .attr("x1",  si)
        // .attr("y1", valueAxis(80))
        // .attr("x2",resources.PADDINGLEFT)
        // .attr("y2", valueAxis(80))
        

    function showLineToolTip(d: any) {
            let percentage = d[1];
            percentage = Math.round((percentage + Number.EPSILON) * 100) / 100
            let text:string = "Cumulative percentage: " + percentage + "%";
             // display the text
             settings.tooltip.show(text); 
     }
}
