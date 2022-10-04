import {createLabelY} from "./utility/methods"
/**
 * Render the vertical scale.
 * @param {number} max Max value on Y scale
 * @param {Spotfire.Axis} yAxis - The Y axes
 * @param {Spotfire.ModProperty<string>} yAxisMode - Property used to determine if the scale should be rendered in percent.
 * @param {Spotfire.Mod} mod API
 */
export function renderYScale(max, yAxis, yAxisMode, mod) {
    const yAxisDiv = document.getElementById("y-axis");
    yAxisDiv.innerHTML = "";
    yAxisMode.set("numeric")
    if (max === 0) {
        return;
    }
    let percent = 0;
    let value = Math.round((max * percent) / 100);
    do {
        yAxisDiv.appendChild(createLabelY(value));

        percent += 10;
        value = Math.round((max * percent) / 100);
        if (value === 0) {
            break;
        }
    } while (percent <= 100);
    yAxisDiv.onmouseenter = () => mod.controls.tooltip.show(yAxis.name + ": " + yAxis.expression);
    yAxisDiv.onmouseleave = () => mod.controls.tooltip.hide();

}