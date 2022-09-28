import {createLabelX} from "./utility/methods"

/**
 * WIP
 * @param {*} xLeaves 
 * @param {*} axis 
 * @param {*} dataView 
 */
export function renderXScale(xLeaves, axis, dataView) {

    // TODO: This is incomplete
    const xScaleDiv = document.getElementById("x-scale");
    xScaleDiv.innerHTML = "";

    xLeaves.forEach(node => {
        xScaleDiv.appendChild(createLabelX(node.key));
        console.log(node.key);
    });
}