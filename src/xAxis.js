import {createLabelX} from "./utility/methods"

/**
 * Render the X scales and displays the categorical values
 * @param {*} xLeaves 
 */
export function renderXScale(xLeaves) {

    const xScaleDiv = document.getElementById("x-axis");
    xScaleDiv.innerHTML = "";

    xLeaves.forEach(node => {
        xScaleDiv.appendChild(createLabelX(node.key));
    });
}