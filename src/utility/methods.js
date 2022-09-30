/**
 * Create a div element.
 * @param {string} className class name of the div element.
 * @param {string | HTMLElement} [content] Content inside the div
 */
 export function createDiv(className, content) {
    let elem = document.createElement("div");
    elem.classList.add(className);
    if (typeof content === "string") {
        elem.appendChild(document.createTextNode(content));
    } else if (content) {
        elem.appendChild(content);
    }
    return elem;
}

/**
 * Render a scale label
 * @param {number} value
 */
 export function createLabelY(value) {
    let label = createDiv("scale-labelY", "" + value);
    let tick = createDiv("tick", "")
    tick.style.width = "5px";
    tick.style.borderBottom = "1px solid black";
    tick.style.marginRight = "-3px";
    tick.style.marginLeft = "3px";
    label.appendChild(tick);
    label.style.color = "#FA7864";
    label.style.fontSize = 10 + "px";
    return label;
}
/**
 * Render a scale label
 * @param {number} value
 */
 export function createLabelColorAxis(value) {
    let label = createDiv("scale-labelColorAxis", "" + value);
    let tick = createDiv("tick", "")
    tick.style.width = "5px";
    tick.style.borderBottom = "1px solid black";
    tick.style.marginLeft = "-3px";
    tick.style.marginRight = "3px";
    label.prepend(tick);
    label.style.color = "#375FDB";
    label.style.fontSize = 10 + "px";
    return label;
}


/**
 * Render a scale label
 * @param {number} value
 */
 export function createLabelX(value) {
    let label = createDiv("scale-labelX", "" + value);
    /*
    let tick = createDiv("tick", "")
    tick.style.width = "5px";
    tick.style.borderBottom = "1px solid black";
    tick.style.marginRight = "-3px";
    tick.style.marginLeft = "3px";
    label.appendChild(tick);   
    */
    return label;
}
/**
 * Calculate the maximum value from a hierarchy. 
 * @param {Spotfire.DataViewHierarchyNode[]} xLeaves
 * @param {Spotfire.ModProperty<boolean>} stackedBars
 */
 export function calculateMaxYValue(xLeaves, stackedBars) {
    let maxYValue = 0;
    if (stackedBars.value()) {
        xLeaves.forEach((node) => {git 
            maxYValue = Math.max(maxValue(node.rows(), "Y"), maxYValue);
        });
    } else {
        xLeaves.forEach((node) => {
            let sum = sumValue(node.rows(), "Y");
            maxYValue = Math.max(maxYValue, sum);
        });
    }

    return maxYValue;
}
/**
 * Calculate the total value for an axis from a set of rows. Null values are treated a 0.
 * @param {Spotfire.DataViewRow[]} rows Rows to calculate the total value from
 * @param {string} axis Name of Axis to use to calculate the value.
 */
 function sumValue(rows, axis) {
    return rows.reduce((p, c) => +c.continuous(axis).value() + p, 0);
}

/**
 * Calculate the max value for an axis from a set of rows. Null values are treated a 0.
 * @param {Spotfire.DataViewRow[]} rows Rows to calculate the max value from
 * @param {string} axis Name of Axis to use to calculate the value.
 */
function maxValue(rows, axis) {
    return rows.reduce((p, c) => Math.max(+c.continuous(axis).value(), p), 0);
}