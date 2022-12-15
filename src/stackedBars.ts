import * as d3 from "d3";
import { Bar, Pareto } from "./pareto";
import { Settings } from "./settings";
import {
    moduleCategoryAxis,
    moduleValueAxis,
    moduleTicks,
    moduleCategories,
    modulePercentageAxis,
    moduleIndices
} from "./axis";

import { rectangularSelection } from "./rectangleMarking";
import { resources } from "./resources";
import { randomBates, style } from "d3";
/**
 * Render the bars using d3
 * @param pareto Pareto data structure
 * @param settings Settings that should be used
 */

export function renderStackedBars(pareto: Pareto, settings: Settings) {
    const paretoCategoryValues: string[] = moduleCategories(pareto);
    const svg: SVGElement = document.querySelector("#svg") as SVGElement;
    const svgBoundingClientRect: DOMRect = svg.getBoundingClientRect();
    const ticks = moduleTicks(svgBoundingClientRect.height, settings.style.label.size);
    const categoryAxis = moduleCategoryAxis(paretoCategoryValues, 0, svgBoundingClientRect.width);
    const valueAxis = moduleValueAxis(pareto.maxValue, svgBoundingClientRect.height, ticks);
    const percentageAxis = modulePercentageAxis(svgBoundingClientRect.height);

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

    // Draw the 80/20 cutoff line
    const range = svgBoundingClientRect.width - resources.PADDINGRIGHT;
    sel.append("line")
        .style("stroke", "#FA7864")
        .style("stroke-width", resources.LINEWEIGHT)
        .style("stroke-dasharray", "8 8 ")
        .attr("x1", range - 3)
        .attr("y1", percentageAxis(80))
        .attr("x2", 0 + 2)
        .attr("y2", percentageAxis(80))
        .on("click", selectedBars)
        .on("mouseover", function () {
            showLineToolTip();
            drawHoverLine();
        })
        .on("mouseout", function () {
            d3.selectAll(".hover-line").remove();
            settings.tooltip.hide();
        });
    // Add invisible line to click on
    sel.append("line")
        .style("stroke", "transparent")
        .style("stroke-width", resources.LINEWEIGHT)
        .attr("x1", range)
        .attr("y1", percentageAxis(80))
        .attr("x2", 0)
        .attr("y2", percentageAxis(80))
        .on("click", selectedBars)
        .on("mouseover", function () {
            showLineToolTip();
            drawHoverLine();
        })
        .on("mouseout", function () {
            d3.selectAll(".hover-line").remove();
            settings.tooltip.hide();
        });

    function drawHoverLine() {
        sel.append("rect")
            .classed("hover-line", true)
            .attr("stroke", settings.style.onMouseOverBox.stroke)
            .attr("stroke-width", settings.style.onMouseOverBox.strokeWidth)
            .attr("shape-rendering", "crispEdges")
            .attr("rx", "3")
            .attr("fill", "none")
            .attr("x", 0)
            .attr("y", percentageAxis(80) - 3)
            .attr("height", resources.LINEWEIGHT + 3)
            .attr("width", range);
    }

    //cutoff.append("path").datum(hoverLine).style("stroke", "black");
    //add an a
    inBars
        .on("click", function (event: any, d: any) {
            d.mark(event);
            //showOnlyBars(pareto, settings);
        })
        .on("mouseover", function (event: any, d: any) {
            const nodes = inBars.nodes();

            const i = nodes.indexOf(this);
            let thisRect = nodes[i] as SVGAElement;
            let parentGroup = d3.select(thisRect.parentElement);
            addSelectionBox(parentGroup, thisRect, "inbar-hover-border", settings);
            settings.tooltip.show(d.row);
        })
        .on("mouseout", function (event: any, d: any) {
            d3.select(".inbar-hover-border").remove();
            settings.tooltip.hide();
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
            .attr("stroke", settings.style.onMouseOverBox.stroke)
            .attr("stroke-width", settings.style.onMouseOverBox.strokeWidth)
            .attr("shape-rendering", "crispEdges")
            .attr("fill", "none");
    }

    rectangularSelection({
        clearMarking: settings.clearMarking,
        mark: (d: Bar) => d.mark(),
        markingSelector: ".in-bar"
    });

    function selectedBars() {
        for (let i of pareto.stackedBars) {
            if (i.cumulativePercentage <= 80) {
                console.log(i.bars);
                for (let j of i.bars) {
                    j.mark();
                }
            }
        }
    }
    function showLineToolTip() {
        let text: string = "80% cut-off ";
        // display the text
        settings.tooltip.show(text);
    }
}
