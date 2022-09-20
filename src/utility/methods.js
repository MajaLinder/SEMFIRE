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
    let label = createDiv("scale-labelY", "" + value);
    label.style.color = "#FA7864";
    label.style.fontSize = 10 + "px";
    label.style.bottom = yPosition + "%";
    return label;
}