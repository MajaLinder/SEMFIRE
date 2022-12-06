import * as d3 from "d3";
import { Pareto } from "./pareto";
import { Settings } from "./settings";
import { resources } from "./resources";
import { Tooltip } from "spotfire-api";

export function renderAxes(pareto: Pareto, settings: Settings, tooltip: Tooltip) {
    d3.selectAll("path").remove();
    d3.selectAll("g").remove();

    const paretoCategoryValues: string[] = moduleCategories(pareto);

    const svg: SVGElement = document.querySelector("#svg")!;
    const svgBoundingClientRect: SVGRect = svg.getBoundingClientRect();
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
        .attr("class", "categoryAxis")
        .style("font-size", "10px")
        .call(
            d3
                .axisBottom(categoryAxis)
                .scale(categoryAxis)
                .tickValues(
                    categoryAxis.domain().filter(function (t, i) {
                        const MIN_WIDTH = 30;
                        let skip = Math.round((MIN_WIDTH * pareto.stackedBars.length) / svgBoundingClientRect.width);
                        skip = Math.max(1, skip);

                        return i % skip === 0 ? t : null;
                    })
                )
        )
        //show the complete category name or value on hover
        .selectAll("text")
        .attr("tooltip", (d: any) => d)
        .on("mouseover", function (event: any, d: any) {
            tooltip.show(d);
        })
        .on("mouseout", function (d: any) {
            tooltip.hide();
        });

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

    var barWidth = categoryAxis.bandwidth();

    function wrap(this: any) {
        var self = d3.select(this),
            textLength = self.node().getComputedTextLength(),
            text = self.text();
        while (textLength > barWidth && text.length > 1) {
            text = text.slice(0, -1);
            if (text.length === 1 && text.length + 3 > barWidth) {
                self.text(text);
            } else {
                self.text(text + "...");
            }

            textLength = self.node().getComputedTextLength();
        }
    }

    d3.select(".categoryAxis")
        .selectAll(".tick")
        .selectAll("text")
        .html("")
        .append("tspan")
        .text(function (d: any) {
            return d;
        })
        .each(wrap);
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
const moduleValueAxis = (domain: number, rangeHeight: number, ticks: number) => {
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
