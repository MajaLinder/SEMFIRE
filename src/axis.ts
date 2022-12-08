import * as d3 from "d3";
import { Pareto } from "./pareto";
import { RenderInfo, Settings } from "./settings";

/**
 * Render the bars using d3
 * * @param settings Settingd data Structure
 */

export function renderAxes(pareto: Pareto, settings: Settings) {
    d3.selectAll("path").remove();
    d3.selectAll("g").remove();

    const paretoCategoryValues: string[] = moduleCategories(pareto);

    let ticks = moduleTicks(pareto);
    var d3svg = d3.select("svg");
    const svg: any = document.querySelector("#svg");
    const svgBoundingClientRect: any = svg.getBoundingClientRect();

    var d3svg = d3.select("svg");
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue, svgBoundingClientRect.height, ticks);
    const percentageAxis = modulePercentageAxis(svgBoundingClientRect.height);

    var g = d3svg.append("g").attr("transform", "translate(" + 65 + "," + 0 + ")");

    console.log("fontfamily: " + settings.style.label.fontFamily);
    console.log("scaleStroke", settings.style.lines.scaleStroke);

    g.select("g")
        .call(d3.axisLeft(valueAxis).ticks(ticks))
        .call(d3.axisBottom, d3.axisLeft, d3.axisRight, d3.axisTop(categoryAxis).scale(categoryAxis))
        .call(d3.axisBottom, d3.axisLeft, d3.axisRight, d3.axisTop(categoryAxis).scale(categoryAxis))
        .attr("class", "label")
        .style("opacity", 0)
        .attr("dy", "0.35em")
        .style("font-size", settings.style.label.size)
        .attr("font-style", settings.style.label.fontStyle)
        .attr("font-weight", settings.style.label.weight)
        .attr("fill", settings.style.label.color)
        .style("font-family", settings.style.label.fontFamily)
        .style("color", settings.style.lines.scaleStroke);

    g.append("g")
        .attr("transform", "translate(0," + (svgBoundingClientRect.height - 50) + ")")
        // .style("font-family", settings.style.label.fontFamily)
        // .style("color", settings.style.label.color)
        // .style("font-style", settings.style.label.fontStyle)
        // .style("font-size", settings.style.label.size)
        // .style("scaleStroke", settings.style.lines.scaleStroke)
        .call(d3.axisBottom(categoryAxis).scale(categoryAxis));

    g.append("g")
        // .style("font-family", settings.style.label.fontFamily)
        // .style("color", settings.style.label.color)
        // .style("font-style", settings.style.label.fontStyle)
        // .style("font-size", settings.style.label.size)
        .call(d3.axisLeft(valueAxis).ticks(ticks));
    // .style("stroke", settings.style.ticks.stroke),

    g.append("g")
        .attr("transform", "translate(" + (svgBoundingClientRect.width - 100) + " ,0)")
        // .style("font-family", settings.style.label.fontFamily)
        // .style("color", settings.style.label.color)
        // //.style("color", settings.style.lines.scaleStroke)
        // .style("font-style", settings.style.label.fontStyle)
        // .style("font-size", settings.style.label.size)
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

export function renderLabels(parent: d3.Selection<SVGElement, unknown, HTMLElement, any>, renderInfo: RenderInfo) {
    const labelsContainer = parent
        .append("g")
        .attr("id", "LabelsContainer")
        .attr("clip-path", "url(#LabelsClip)")
        .attr("class", renderInfo.state.isEditing ? "skip-unmark" : "")
        .style("cursor", renderInfo.state.isEditing ? "pointer" : "default");
    const labels = labelsContainer.append("g").attr("id", "Labels");
}

const moduleCategoryAxis = (domain: any, rangeStart: number, rangeWidth: number) => {
    let categoryAxis = d3
        .scaleBand()
        .domain(domain)
        .range([rangeStart, rangeWidth - 100])
        .paddingInner(0.13)
        .paddingOuter(0.26);
    return categoryAxis;
};
const moduleValueAxis = (domain: any, rangeHeight: number, ticks: number) => {
    let valueAxis = d3
        .scaleLinear()
        .domain([0, domain])
        .nice(ticks)
        .range([rangeHeight - 50, 100]);
    return valueAxis;
};
const modulePercentageAxis = (rangeHeight: number) => {
    let percentageAxis = d3
        .scaleLinear()
        .domain([0, 100])
        .range([rangeHeight - 50, 100]);
    return percentageAxis;
};
const moduleCategories = (pareto: Pareto) => {
    const paretoCategoryValues: string[] = [];
    pareto.stackedBars.forEach((p) => {
        paretoCategoryValues.push(p.label);
    });

    return paretoCategoryValues;
};
const moduleTicks = (pareto: Pareto) => {
    let ticks: number = 0;
    if (pareto.maxValue <= 50) {
        ticks = 5;
    } else if (pareto.maxValue > 50 && pareto.maxValue <= 100) {
        ticks = 10;
    } else {
        ticks = 20;
    }
    return ticks;
};
export { moduleCategoryAxis, modulePercentageAxis, moduleValueAxis, moduleTicks, moduleCategories };
