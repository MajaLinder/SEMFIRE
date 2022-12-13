import { renderAxes } from "./axis";
import { Pareto } from "./pareto";
import { renderStackedBars } from "./stackedBars";
import { renderCumulativeLine } from "./cumulativeLine";
import { Settings } from "./Settings";
import * as d3 from "d3";
import { clearLineMarking } from "./rectangleMarking";

//Added the settings interface in settings.ts
// export interface Settings {
//     //here you define all settings that have an effect on how the pareto chart will be rendered and look like,
//     //for example: tick stroke width, tick length, etc
// }

/**
 * Draws pareto with the given settings
 * @param pareto - Pareto to write in console
 * @param settings - Settings that should be used
 */

export function renderPareto(pareto: Pareto, settings: Settings) {
    // const svg: SVGElement = document.querySelector("#svg")!;
    // const svgBoundingClientRect: SVGRect = svg.getBoundingClientRect();

    // // background canvas for click events
    // d3.select("#svg")
    //     .append("rect")
    //     .attr("fill", "#000")
    //     .attr("fill-opacity", 0)
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("width", svgBoundingClientRect.width)
    //     .attr("height", svgBoundingClientRect.height)
    //     .on("click", () => {
    //         console.log("clicking");
    //         settings.clearMarking();
    //         //clearLineMarking(pareto, settings);
    //     });

    renderAxes(pareto, settings);
    renderStackedBars(pareto, settings);
    renderCumulativeLine(pareto, settings);
    //renderSettings(settings);
}

/**
 * Writes a textual representation of the pareto in debugging console
 * @param pareto - Pareto to write in console
 * @param settings - Settings that should be used
 */
export function renderParetoAsTextInConsole(pareto: Pareto, settings: Settings) {
    pareto.stackedBars.forEach((p) => {
        console.log(
            "(" + p.position + ") " + p.label + " - " + p.totalValue + " (" + p.cumulativePercentage.toFixed(2) + "%)"
        );
        if (p.bars?.length > 1) {
            p.bars.forEach((bar) => {
                console.log("     " + bar.label + " - " + bar.value + " (" + bar.color + ")");
            });
        }
    });

    console.log("Max value: " + pareto.maxValue);
    console.log("Min value: " + pareto.minValue);
}
