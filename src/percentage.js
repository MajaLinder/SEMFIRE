import {createLabelPercentage} from "./utility/methods"
import {createTick} from "./utility/methods"
/**
 * Render the percentage scale.
 * @param {number} max Max value on Y scale
 * @param {Spotfire.Axis} yAxis - The Y axes
 * @param {Spotfire.ModProperty<string>} yAxisMode - Property used to determine if the scale should be rendered in percent.
 * @param {Spotfire.Mod} mod API
 */
export function renderPercentage(max, yAxis,yAxisMode, mod) {
    const percentageDiv = document.getElementById("percentage");
    percentageDiv.innerHTML = "";
    yAxisMode.set("percentage")
    max = 100;
    let percent = 0;
    let value = Math.round((max * percent) / 100);
    do {
        percentageDiv.appendChild(createLabelPercentage(value + "%", percent));
        percentageDiv.appendChild(createTick(percent));

        percent += 10;
        value = Math.round((max * percent) / 100);
        if (value === 0) {
            break;
        }
    } while (percent <= 100);
    percentageDiv.onmouseenter = () => mod.controls.tooltip.show(yAxis.name + ": " + yAxis.expression);
    percentageDiv.onmouseleave = () => mod.controls.tooltip.hide();

}