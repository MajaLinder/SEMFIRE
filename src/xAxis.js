import {createLabelX} from "./utility/methods"

/**
 * Render the X scales and displays the categorical values
 * @param {*} xLeaves 
 * @param {*} mod mod api
 */
export function renderXScale(xLeaves, mod) {

    const stroke = mod.getRenderContext().styling.scales.line.stroke;
    const xLabelColor = mod.getRenderContext().styling.scales.font.color
    const xScaleDiv = document.getElementById("x-axis");

    xScaleDiv.innerHTML = "";
    xScaleDiv.style.color = xLabelColor;
    xScaleDiv.style.borderTop = "1px solid " + stroke;

    xLeaves.forEach(node => {
        xScaleDiv.appendChild(createLabelX(node.key));
    });
}