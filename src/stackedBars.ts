import * as d3 from "d3";
import { Pareto } from "./pareto";
import { Settings } from "./settings";
import { moduleCategoryAxis, moduleValueAxis, moduleTicks, moduleCategories } from "./axis";

/**
 * Render the bars using d3
 * @param pareto Pareto data structure
 */

export function renderStackedBars(pareto: Pareto, settings: Settings) {
    const STROKEWIDTH = 0.5;

    const paretoCategoryValues: string[] = moduleCategories(pareto);

    const svg: any = document.querySelector("#svg");
    const svgBoundingClientRect: any = svg.getBoundingClientRect();
    const ticks = moduleTicks(svgBoundingClientRect.height, settings.style.label.size);
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue, svgBoundingClientRect.height, ticks);

    var d3svg = d3.select("svg");
    let g = d3svg.select("g");

    g.selectAll(".bar")
        .data(pareto.stackedBars)
        .enter()
        .append("rect")
        .attr("fill", "pink")
        .attr("class", "bar")
        .attr("x", function (d): any {
            return categoryAxis(d.label);
        })
        .attr("y", function (d): any {
            return valueAxis(d.totalValue);
        })
        .attr("width", categoryAxis.bandwidth())
        .attr("height", function (d) {
            return svgBoundingClientRect.height - 50 - Number(valueAxis(d.totalValue));
        });
    g.selectAll("rect").on("click", function () {
        d3.select(this).style("stroke", settings.style.marking.color).style("stroke-width", STROKEWIDTH);
    });
}
