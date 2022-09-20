import {createLabelY} from "./utility/methods"
/**
 * Render the vertical scale.
 * @param {number} max Max value on Y scale
 * @param {Spotfire.Axis} yAxis - The Y axes
 * @param {Spotfire.ModProperty<string>} yAxisMode - Property used to determine if the scale should be rendered in percent.
 * @param {Spotfire.Mod} mod API
 */
export function renderYScale(max, yAxis, yAxisMode, mod) {
    const yScaleDiv = document.getElementById("y-scale");
    yScaleDiv.innerHTML = "";
    yAxisMode.value() === "numeric"
    if (max === 0) {
        return;
    }
    let percent = 0;
    let value = Math.round((max * percent) / 100);
    do {
        yScaleDiv.appendChild(createLabelY(value, percent));

        percent += 10;
        value = Math.round((max * percent) / 100);
        if (value === 0) {
            break;
        }
    } while (percent <= 100);
    yScaleDiv.onmouseenter = () => mod.controls.tooltip.show(yAxis.name + ": " + yAxis.expression);
    yScaleDiv.onmouseleave = () => mod.controls.tooltip.hide();

}


