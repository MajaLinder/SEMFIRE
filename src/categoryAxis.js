import {createLabelX} from "./utility/methods"

/**
 * Render the X scales and displays the categorical values
 * @param {*} xLeaves 
 * @param {*} mod mod api
 */
export function renderCategoryScale(xLeaves, mod) {

    const stroke = mod.getRenderContext().styling.scales.line.stroke;
    const xLabelColor = mod.getRenderContext().styling.scales.font.color
    const xScaleDiv = document.getElementById("category-axis");
    const xFontSize = mod.getRenderContext().styling.scales.font.fontSize + "px";

    xScaleDiv.innerHTML = "";
    xScaleDiv.style.color = xLabelColor;
    xScaleDiv.style.borderTop = "1px solid " + stroke;
    xScaleDiv.style.fontSize = xFontSize;

    xLeaves.forEach(node => {
        xScaleDiv.appendChild(createLabelX(node.key));
    });
}