import * as d3 from "d3";
import { Bar, Pareto } from "./pareto";
import { Settings } from "./settings";
import { moduleCategoryAxis, moduleValueAxis, moduleTicks, moduleCategories } from "./axis";
import { resources } from "./resources";
import { Tooltip } from "spotfire-api";
import { rectangularSelection } from "./rectangleMarking";

/**
 * Render the bars using d3
 * @param pareto Pareto data structure
 * @param settings Settings that should be used
 */

export function renderStackedBars(pareto: Pareto, settings: Settings, tooltip: Tooltip) {
    const paretoCategoryValues: string[] = moduleCategories(pareto);
    const svg: SVGElement = document.querySelector("#svg") as SVGElement;
    const svgBoundingClientRect: DOMRect = svg.getBoundingClientRect();
    const ticks = moduleTicks(svgBoundingClientRect.height, settings.style.label.size);
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue, svgBoundingClientRect.height, ticks);

    // Create a group for each series
    var sel = d3
        .select("#svg")
        .select("g")
        .selectAll("g.series")
        .data(pareto.stackedBars)
        .join("g")
        .classed("series", true)
        .attr("id", (d) => d.key);

    //For each series, create a rectangle for each color key
    var inBars = sel
        .selectAll("rect")
        .data((d) => d.bars)
        .join("rect")
        .classed("in-bar", true)
        .attr("y", (d) => (valueAxis(d.y0 + d.value) ?? 0) + settings.style.inbarsSeparatorWidth)
        .attr("x", (d) => categoryAxis(d.parentKey) ?? 0)
        .attr("height", (d) =>
            Math.max(
                Math.abs((valueAxis(d.y0) ?? 0) - (valueAxis(d.y0 + d.value) ?? 0)) -
                    settings.style.inbarsSeparatorWidth,
                1
            )
        )
        .attr("width", categoryAxis.bandwidth())
        .style("fill", (d) => d.color)
        .attr("shape-rendering", "crispEdges")
        .attr("stroke", (d) => (d.isMarked ? "#000" : "none"))
        .attr("stroke-width", (d) => (d.isMarked ? settings.style.selectionBox.strokeWidth : "0"));

    //add an a
    inBars
        .on("click", function (event: any, d: any) {
            d.mark(event);
        })
        .on("mouseover", function (event: any, d: any) {
            const nodes = inBars.nodes();
            const i = nodes.indexOf(this);
            let thisRect = nodes[i] as SVGAElement;
            let parentGroup = d3.select(thisRect.parentElement);
            addSelectionBox(parentGroup, thisRect, "inbar-hover-border", settings);
            showBarToolTip(d);
        })
        .on("mouseout", function (event: any, d: any) {
            d3.select(".inbar-hover-border").remove();
            tooltip.hide();
        });

    function addSelectionBox(selection: any, baseRectangle: SVGAElement, cssClass: string, settings: Settings) {
        let bBox = baseRectangle.getBBox();
        let padding = settings.style.onMouseOverBox.padding;
        selection
            .append("rect")
            .classed(cssClass, true)
            .attr("y", bBox.y - padding)
            .attr("x", bBox.x - padding)
            .attr("height", bBox.height + 2 * padding)
            .attr("width", bBox.width + 2 * padding)
            .attr("stroke", "#000")
            .attr("stroke-width", settings.style.onMouseOverBox.strokeWidth)
            .attr("shape-rendering", "crispEdges")
            .attr("fill", "none");
    }

    rectangularSelection({
        clearMarking: settings.clearMarking,
        mark: (d: Bar) => d.mark(),
        markingSelector: ".in-bar"
    });

    /**
     * Display tooltip for a bar
     * @param d Bar
     */
    function showBarToolTip(d: any) {
        if (pareto.categoryAxisName != null && pareto.valueAxisName != null) {
            let text: string = pareto.categoryAxisName + ": " + d.parentLabel + "\n";
            text += pareto.valueAxisName + ": " + d.value;
            if (pareto.colorByAxisName != null) {
                text += "\n" + pareto.colorByAxisName + ": " + d.label;
            }
            // find the cummulative percentage
            let percentage = pareto.stackedBars.find((element) => element.key === d.parentKey)
                ?.cumulativePercentage as number;
            // round percentage to two decimals
            percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;
            text += "\nCumulative percentage: " + percentage + "%";

            // display the text
            tooltip.show(text);
        }
    }
}
