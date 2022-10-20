import {createDiv} from "./utility/methods"
import {sumValue} from "./utility/methods"
    
    /**
     * Render all bars on the stackedBars div.
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.DataViewHierarchyNode[]} xLeafNodes
     * @param {number} maxValue
     * @param {Spotfire.ModProperty<boolean>} stackedBars
     */
     export function renderBars(xLeafNodes, categoricalColorCount, maxValue, stackedBars) {
        const stackedBarsDiv = document.getElementById("stackedBars");
        stackedBarsDiv.innerHTML = "";

        const stackedBarsHeight = stackedBarsDiv.offsetHeight;

        xLeafNodes.forEach((leafNode) => stackedBarsDiv.appendChild(renderBar(leafNode)));

        /**
         * Render bars/segments for a single x axis node.
         * @param {Spotfire.DataViewHierarchyNode} xLeafNode
         */
        function renderBar(xLeafNode) {
            let fragment = document.createDocumentFragment();
            let rows = xLeafNode.rows();

            if (stackedBars.value() && categoricalColorCount > 1) {
                // Render bars side by side. We need to add one bar per color to
                // keep all groups equally wide. So we create a sparse array where
                // we store the rows per color index, and render a bar for each
                // element in the array.
                let bars = new Array(categoricalColorCount).fill(null);
                rows.forEach((row) => {
                    let colorValue = row.categorical("Color");
                    bars[colorValue.leafIndex] = row;
                });

                bars.forEach((row) => {
                    fragment.appendChild(renderStackedBar(xLeafNode, row ? [row] : []));
                });
            } else {
                fragment.appendChild(renderStackedBar(rows));
            } 

            return fragment;
        }

        /**
         * Render a stacked bar in the bar chart from a set of source rows.
         * @param {Spotfire.DataViewHierarchyNode} xLeafNode
         * @param {Spotfire.DataViewRow[]} rows
         */
        function renderStackedBar(rows) {
            let bar = createDiv("bar");

            let totalBarValue = sumValue(rows, "Value");
            bar.style.height = Math.round((totalBarValue / maxValue) * stackedBarsHeight) + "px";

            rows.forEach((row) => {
                let value = row.continuous("Value");
                if (value.value() === null) {
                    return;
                }

                let segment = createDiv("segment");
                segment.style.height = (+value.value() / maxValue) * stackedBarsHeight + "px";
                segment.style.backgroundColor = row.color().hexCode;

                bar.appendChild(segment);
            });

            return bar;
        }
    }