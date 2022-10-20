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
 export function createLabelValue(value) {
    let label = createDiv("scale-labelValue", "" + value);
    let tick = createDiv("tick", "")
    tick.style.width = "5px";
    tick.style.borderBottom = "1px solid black";
    tick.style.marginRight = "-3px";
    tick.style.marginLeft = "3px";
    label.appendChild(tick);
    return label;
}
/**
 * Render a scale label
 * @param {number} value
 */
 export function createLabelPercentage(value) {
    let label = createDiv("scale-labelPercentage", "" + value);
    let tick = createDiv("tick", "")
    tick.style.width = "5px";
    tick.style.borderBottom = "1px solid black";
    tick.style.marginLeft = "-3px";
    tick.style.marginRight = "3px";
    label.prepend(tick);
    return label;
}


/**
 * Render a scale label
 * @param {number} value
 */
 export function createLabelCategory(value) {
    let label = createDiv("scale-labelCategory", "" + value);
    // let tick = createDiv("tick", "")
    // tick.style.height = "5px";
    // tick.style.width = "1px";
    // tick.style.borderBottom = "5px solid black";
    // tick.style.marginRight = "-3px";
    // tick.style.marginLeft = "3px";
    // label.appendChild(tick);
    // label.style.color = "#FA7864";
    // label.style.fontSize = 10 + "px";
    return label;
}
/**
 * Calculate the maximum value from a hierarchy. 
 * @param {Spotfire.DataViewHierarchyNode[]} xLeaves
 * @param {Spotfire.ModProperty<boolean>} stackedBars
 */
 export function calculateMaxValue(xLeaves, stackedBars) {
    let maxValue = 0;
    if (stackedBars.value()) {
        xLeaves.forEach((node) => {git 
            maxValue = Math.max(maxValue(node.rows(), "Value"), maxValue);
        });
    } else {
        xLeaves.forEach((node) => {
            let sum = sumValue(node.rows(), "Value");
            maxValue = Math.max(maxValue, sum);
        });
    }

    return maxValue;
}
/**
 * Calculate the total value for an axis from a set of rows. Null values are treated a 0.
 * @param {Spotfire.DataViewRow[]} rows Rows to calculate the total value from
 * @param {string} axis Name of Axis to use to calculate the value.
 */
 export function sumValue(rows, axis) {
    return rows.reduce((p, c) => +c.continuous(axis).value() + p, 0);
}

/**
 * Calculate the max value for an axis from a set of rows. Null values are treated a 0.
 * @param {Spotfire.DataViewRow[]} rows Rows to calculate the max value from
 * @param {string} axis Name of Axis to use to calculate the value.
 */
export function maxValue(rows, axis) {
    return rows.reduce((p, c) => Math.max(+c.continuous(axis).value(), p), 0);
}

/**
 * Sort the xLeaves in descending order
 * @param {Spotfire.DataViewHierarchyNode[]} xLeaves
 */
 export function sortDescending(xLeaves) {
    xLeaves.sort((a, b) => {
            return Number(sumValue(b.rows(), "Value")) - Number(sumValue(a.rows(), "Value"));
        }
    );  
}