import { createLabelZ } from "./utility/methods"
/**
 * Render the vertical scale.
 * @param {number} max Max value on Y scale
 * @param {Spotfire.Axis} yAxis - The Y axes
 * @param {Spotfire.ModProperty<string>} yAxisMode - Property used to determine if the scale should be rendered in percent.
 * @param {Spotfire.Mod} mod API
 */
export function renderZScale(max, yAxis,yAxisMode, mod) {
    const zScaleDiv = document.getElementById("z-scale");
    zScaleDiv.innerHTML = "";
    yAxisMode.set("percentage")
    max = 100;
    let percent = 0;
    let value = Math.round((max * percent) / 100);
    do {
        zScaleDiv.appendChild(createLabelZ(value + "%"));

        percent += 10;
        value = Math.round((max * percent) / 100);
        if (value === 0) {
            break;
        }
    } while (percent <= 100);
    zScaleDiv.onmouseenter = () => mod.controls.tooltip.show(yAxis.name + ": " + yAxis.expression);
    zScaleDiv.onmouseleave = () => mod.controls.tooltip.hide();

}