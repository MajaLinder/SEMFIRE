import { createLabelColorAxis } from "./utility/methods"
/**
 * Render the vertical scale.
 * @param {number} max Max value on Y scale
 * @param {Spotfire.Axis} yAxis - The Y axes
 * @param {Spotfire.ModProperty<string>} yAxisMode - Property used to determine if the scale should be rendered in percent.
 * @param {Spotfire.Mod} mod API
 */
export function rendercolorScale(max, yAxis,yAxisMode, mod) {
    const colorScaleDiv = document.getElementById("color-scale");
    colorScaleDiv.innerHTML = "";
    yAxisMode.set("percentage")
    max = 100;
    let percent = 0;
    let value = Math.round((max * percent) / 100);
    do {
        colorScaleDiv.appendChild(createLabelColorAxis(value + "%"));

        percent += 10;
        value = Math.round((max * percent) / 100);
        if (value === 0) {
            break;
        }
    } while (percent <= 100);
    colorScaleDiv.onmouseenter = () => mod.controls.tooltip.show(yAxis.name + ": " + yAxis.expression);
    colorScaleDiv.onmouseleave = () => mod.controls.tooltip.hide();

}