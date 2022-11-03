import { createLabelPercentage } from "./utility/methods";
/**
 * Render the percentage scale.
 * @param {number} max Max value on value scale
 * @param {Spotfire.Axis} valueAxis - The value axis
 * @param {Spotfire.ModProperty<string>} valueAxisMode - Property used to determine if the scale should be rendered in percent.
 * @param {Spotfire.Mod} mod API
 */
export function renderPercentage(max, valueAxis, valueAxisMode, mod) {
    // const stroke = mod.getRenderContext().styling.scales.line.stroke;
    // const percentageDiv = document.getElementById("percentage");
    // const persentageLabelColor = mod.getRenderContext().styling.scales.font.color;
    // const percentageFontSize = mod.getRenderContext().styling.scales.font.fontSize + "px";
    // percentageDiv.innerHTML = "";
    // percentageDiv.style.borderLeft = "1px solid " + stroke;
    // percentageDiv.style.color = persentageLabelColor;
    // percentageDiv.style.fontSize = percentageFontSize;
    // valueAxisMode.set("percentage")
    // max = 100;
    // let percent = 0;
    // let value = Math.round((max * percent) / 100);
    // do {
    //     percentageDiv.appendChild(createLabelPercentage(value + "%"));
    //     percent += 10;
    //     value = Math.round((max * percent) / 100);
    //     if (value === 0) {
    //         break;
    //     }
    // } while (percent <= 100);
    // percentageDiv.onmouseenter = () => mod.controls.tooltip.show(valueAxis.name + ": " + valueAxis.expression);
    // percentageDiv.onmouseleave = () => mod.controls.tooltip.hide();
}
