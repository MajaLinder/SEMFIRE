/**
 * Configuration variables
 */
let _tickWidth = 20;
let _tickThickness = 1;
let _labelFontSize = 10;

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
 * @param {number} yPosition
 */
 export function createLabelY(value, yPosition) {
    let label = createDiv("scale-labelY");
    let labelSpan = document.createElement("span");
    labelSpan.classList.add("label-span");
    labelSpan.style.top = (_tickThickness + _labelFontSize/2) + "px";
    labelSpan.appendChild(document.createTextNode(value.toString()));

    label.appendChild(labelSpan);

    label.style.color = "black";
    label.style.fontSize = _labelFontSize + "px";
    label.style.bottom = yPosition + "%";
    label.style.right = 
    label.style.right = _tickWidth + 2 + "px";
    return label;
}

/**
 * Render a scale label
 * @param {number} yPosition
 */
 export function createTick(yPosition) {
    let tick = createDiv("tick", "")
    tick.style.width = _tickWidth + "px";
    tick.style.borderBottom = "1px solid black";
    tick.style.height = "0xp";
    tick.style.bottom = yPosition + "%";
    return tick; 
}
/**
 * Render a scale label
 * @param {number} value
 * @param {number} yPosition
 */
 export function createLabelPercentage(value, yPosition) {
    let label = createDiv("scale-labelPercentage");
    let labelSpan = document.createElement("span");
    labelSpan.classList.add("label-span");
    labelSpan.style.top = (_tickThickness + _labelFontSize/2) + "px";
    labelSpan.appendChild(document.createTextNode(value.toString()));

    label.appendChild(labelSpan);

    label.style.color = "black";
    label.style.fontSize = _labelFontSize + "px";
    label.style.bottom = yPosition + "%";
    label.style.paddingLeft = _tickWidth + 2 + "px";
    return label;
}


/**
 * Render a scale label
 * @param {number} value
 */
 export function createLabelX(value) {
    let label = createDiv("scale-labelX", "" + value);
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
    xLeaves.sort((a, b) => 
    Number(b.rows()[0].continuous("Y").value()) - Number(a.rows()[0].continuous("Y").value())
);
}