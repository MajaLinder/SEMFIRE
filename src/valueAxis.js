import { createLabelValue } from "./utility/methods";
/**
 * Render the vertical scale.
 * @param {number} max Max value on value scale
 * @param {Spotfire.Axis} valueAxis - The value axis
 * @param {Spotfire.ModProperty<string>} valueAxisMode - Property used to determine if the scale should be rendered in percent.
 * @param {Spotfire.Mod} mod API
 */
export function renderValueScale(max, valueAxis, valueAxisMode, mod) {
    // const stroke = mod.getRenderContext().styling.scales.line.stroke;
    // const valueAxisDiv = document.getElementById("value-axis");
    // const valueLableColor = mod.getRenderContext().styling.scales.font.color;
    // const valueFontSize = mod.getRenderContext().styling.scales.font.fontSize + "px";
    // valueAxisDiv.innerHTML = "";
    // valueAxisDiv.style.borderRight = "1px solid " + stroke;
    // valueAxisDiv.style.color = valueLableColor;
    // valueAxisDiv.style.fontSize = valueFontSize;
    // valueAxisMode.set("numeric")
    // if (max === 0) {
    //     return;
    // }
    // let percent = 0;
    // let value = Math.round((max * percent) / 100);
    // do {
    //     valueAxisDiv.appendChild(createLabelValue(value));
    //     percent += 10;
    //     value = Math.round((max * percent) / 100);
    //     if (value === 0) {
    //         break;
    //     }
    // } while (percent <= 100);
    // valueAxisDiv.onmouseenter = () => mod.controls.tooltip.show(valueAxis.name + ": " + valueAxis.expression);
    // valueAxisDiv.onmouseleave = () => mod.controls.tooltip.hide();
}
