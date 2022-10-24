import {createLabelCategory} from "./utility/methods"

/**
 * Render the X scales and displays the categorical values
 * @param {*} xLeaves 
 * @param {*} mod mod api
 */
export function renderCategoryScale(xLeaves, mod) {

    const stroke = mod.getRenderContext().styling.scales.line.stroke;
    const categoryLabelColor = mod.getRenderContext().styling.scales.font.color
    const categoryAxisDiv = document.getElementById("category-axis");
    const categoryFontSize = mod.getRenderContext().styling.scales.font.fontSize + "px";

    categoryAxisDiv.innerHTML = "";
    categoryAxisDiv.style.color = categoryLabelColor;
    categoryAxisDiv.style.borderTop = "1px solid " + stroke;
    categoryAxisDiv.style.fontSize = categoryFontSize;

    xLeaves.forEach(node => {
        categoryAxisDiv.appendChild(createLabelCategory(node.key));
    });
}