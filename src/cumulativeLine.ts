import * as d3 from "d3";
import { Pareto, StackedBar } from "./pareto";
import { moduleCategoryAxis, moduleIndices, modulePercentageAxis } from "./axis";
import { resources } from "./resources";
import { rectangularSelection } from "./rectangleMarking";
import { Settings } from "./settings";
import { Line } from "d3";

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
    const markedStroke: string = "#3050EF";
    const unMarkedStroke: string = "#d5dcfb";

    // if nothing is marked in the chart then no opacity is applied
    d3svg.selectAll(".line").remove();
    d3svg.selectAll(".line-circle").remove();
    d3svg.selectAll(".dots-group").remove();

    if (pareto.noMarkOnLine == true) {
        // no marking yet only need to render as is
        var line = d3
            .line<any>()
            .x(function (d): number {
                return categoryAxis(d.index)!;
            })
            .y(function (d): number {
                return valueAxis(d.cumulativePercentage)!;
            });

        drawLine(pareto.stackedBars, markedStroke, line);
        drawDots(pareto.stackedBars, markedStroke);
    } else {
        //there is marking to render
        const markedPostions = pareto.stackedBars.filter((line) => line.isMarked == true);
        const unMarkedPositions = pareto.stackedBars.filter((line) => line.isMarked == false);

        var unMarkedline = d3
            .line<any>()
            .x(function (d): number {
                return categoryAxis(d.index)!;
            })
            .y(function (d): number {
                return valueAxis(d.cumulativePercentage)!;
            });

        var markedline = d3
            .line<any>()
            .x(function (d): number {
                return categoryAxis(d.index)!;
            })
            .y(function (d): number {
                return valueAxis(d.cumulativePercentage)!;
            })
            .defined((d) => d.isMarked == true);

        drawLine(pareto.stackedBars, unMarkedStroke, unMarkedline);
        drawLine(pareto.stackedBars, markedStroke, markedline);

        drawDots(unMarkedPositions, unMarkedStroke);
        drawDots(markedPostions, markedStroke);
    }

    function drawLine(lineData: StackedBar[], stroke: string, line: Line<any>) {
        d3svg
            .append("path")
            .datum(lineData)
            .attr("class", "line")
            .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", stroke)
            .style("stroke-width", resources.LINEWEIGHT);
    }

    function drawDots(lineData: StackedBar[], stroke: string) {
        let dots = d3svg
            .append("g")
            .attr("class", "dots-group")
            .selectAll("dot")
            .data(lineData)
            .enter()
            .append("circle")
            .classed("line-circle", true)
            .attr("cx", function (d): any {
                return categoryAxis(d.index as any);
            })
            .attr("cy", function (d): any {
                return valueAxis(d.cumulativePercentage);
            })
            .attr("r", 5)
            .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")")
            .style("fill", stroke)
            .on("click", function (event: any, d: any) {
                pareto.stackedBars.forEach((stackedBar) => {
                    if (stackedBar.cumulativePercentage <= d.cumulativePercentage) stackedBar.mark(event);
                });
            })
            .on("mouseover", function (event: any, d: any) {
                const nodes = dots.nodes();
                const i = nodes.indexOf(this);
                let thisCircle = nodes[i] as SVGCircleElement;
                let parentGroup = d3.select(thisCircle.parentElement);
                drawHoverDots(parentGroup, this, "dot-hover-border");
                showLineToolTip(d);
            })
            .on("mouseout", function () {
                d3.select(".dot-hover-border").remove();
                settings.tooltip.hide();
            });
    }

    function drawHoverDots(selection: any, baseDot: SVGCircleElement, cssClass: string) {
        selection
            .append("circle")
            .classed(cssClass, true)
            .style("pointer-events", "none")
            .attr("cx", baseDot.cx.baseVal.value)
            .attr("cy", baseDot.cy.baseVal.value)
            .attr("transform", "translate(" + resources.PADDINGLEFT + "," + resources.PADDINGBOTTOMDOWN + ")")
            .attr("stroke", settings.style.onMouseOverBox.stroke)
            .attr("stroke-width", settings.style.onMouseOverBox.strokeWidth)
            .attr("fill-opacity", 0)
            .attr("r", 7);
    }

    function showLineToolTip(d: any) {
        let percentage = d.cumulativePercentage;
        percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;
        let text: string = "Cumulative percentage: " + percentage + "%";
        // display the text
        settings.tooltip.show(text);
    }

    rectangularSelection({
        clearMarking: settings.clearMarking,
        mark: (d: StackedBar) => d.mark(),
        markingSelector: ".line-circle"
    });
}
