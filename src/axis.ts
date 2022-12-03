import * as d3 from "d3";
import { Pareto } from "./pareto";
import { Settings } from "./settings";
import { resources } from "./resources";

export function renderAxes(pareto: Pareto, settings: Settings) {
    d3.selectAll("path").remove();
    d3.selectAll("g").remove();

    const paretoCategoryValues: string[] = moduleCategories(pareto);

    const svg: any = document.querySelector("#svg");
    const svgBoundingClientRect: any = svg.getBoundingClientRect();
    let ticks = moduleTicks(svgBoundingClientRect.height, settings.style.label.size);
    
    var d3svg = d3.select("svg");
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue, svgBoundingClientRect.height, ticks);
    const percentageAxis = modulePercentageAxis(svgBoundingClientRect.height);

    var g = d3svg
        .append("g")
        .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")");

    g.append("g")
        .attr(
            "transform",
            "translate(" +
                resources.PADDINGCATEGORYLEFT +
                "," +
                (svgBoundingClientRect.height - resources.PADDINGBOTTOMUP) +
                ")"
        )
        .call(d3.axisBottom(categoryAxis).scale(categoryAxis));

    g.append("g").call(d3.axisLeft(valueAxis).ticks(ticks));
    g.append("g")
        .attr(
            "transform",
            "translate(" +
                (svgBoundingClientRect.width - resources.PADDINGRIGHT) +
                " ," +
                resources.PADDINGPERCENTAGEDOWN +
                ")"
        )
        .call(
            d3
                .axisRight(percentageAxis)
                .tickPadding(2)
                .ticks(10)
                .tickFormat(function (d) {
                    return d + "%";
                })
        );
}

const moduleCategoryAxis = (domain: any, rangeStart: number, rangeWidth: number) => {
    const padding: number = 0.18;

    let categoryAxis = d3
        .scaleBand()
        .domain(domain)
        .range([rangeStart, rangeWidth - resources.PADDINGRIGHT])
        .paddingInner(padding)
        .paddingOuter(padding);
    return categoryAxis;
};
const moduleValueAxis = (domain: any, rangeHeight: number, ticks: number) => {
    let valueAxis = d3
        .scaleLinear()
        .domain([0, domain])
        .nice(ticks)
        .range([rangeHeight - resources.PADDINGBOTTOMUP, resources.PADDINGTOPDOWN]);
    return valueAxis;
};
const modulePercentageAxis = (rangeHeight: number) => {
    let percentageAxis = d3
        .scaleLinear()
        .domain([0, 100])
        .range([rangeHeight - resources.PADDINGBOTTOMUP, resources.PADDINGTOPDOWN]);
    return percentageAxis;
};
const moduleCategories = (pareto: Pareto) => {
    const paretoCategoryValues: string[] = [];
    pareto.stackedBars.forEach((p) => {
        paretoCategoryValues.push(p.key);
    });
    return paretoCategoryValues;
};
const moduleIndices = (pareto: Pareto) => {
    const paretoCategoryIndices: number[] = [];

    pareto.stackedBars.forEach((p) => {
        paretoCategoryIndices.push(p.index);
    });
    return paretoCategoryIndices;
};

/**
 * Calculates ticks based on height and font
 * @param pareto
 * @param height
 * @param labelSize The size of the label font
 * @returns Tick number
 */
const moduleTicks = (height: number, labelSize: number) => {
    let ticks = height / (labelSize * 2 + 6);
    return ticks;
};
export { moduleCategoryAxis, modulePercentageAxis, moduleValueAxis, moduleTicks, moduleCategories, moduleIndices };
