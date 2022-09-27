import {createDiv} from "./utility/methods"
    
    /**
     * Render all bars on the canvas div.
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.DataViewHierarchyNode[]} xLeafNodes
     * @param {number} maxYValue
     * @param {Spotfire.ModProperty<boolean>} stackedBars
     */
     export function renderBars(dataView, xLeafNodes, categoricalColorCount, maxYValue, stackedBars) {
        const canvasDiv = document.getElementById("canvas");
        const xScaleHeight = 20;
        const yScaleWidth = 100;
        canvasDiv.innerHTML = "";
        canvasDiv.style.left = yScaleWidth + "px";
        canvasDiv.style.bottom = xScaleHeight + "px";
        canvasDiv.style.right = "0px";

        canvasDiv.onclick = (e) => {
            if (e.target === canvasDiv) {
                dataView.clearMarking();
            }
        };

        const canvasHeight = canvasDiv.offsetHeight;

        xLeafNodes.forEach((leafNode) => canvasDiv.appendChild(renderBar(leafNode)));

        /**
         * Renders bars/segments for a single x axis node.
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
                fragment.appendChild(renderStackedBar(xLeafNode, rows));
            }

            return fragment;
        }

        /**
         * Render a stacked bar in the bar chart from a set of source rows.
         * @param {Spotfire.DataViewHierarchyNode} xLeafNode
         * @param {Spotfire.DataViewRow[]} rows
         */
        function renderStackedBar(xLeafNode, rows) {
            let bar = createDiv("bar");

            
            // TODO: fix this
            // let totalBarValue = sumValue(rows, "Y");
            bar.style.height = Math.round((100 / maxYValue) * canvasHeight) + "px";

            rows.forEach((row) => {
                //let y = row.continuous("Y");
                //if (y.value() === null) {
                    //return;
                //}

                let segment = createDiv("segment");
                segment.style.height = 100 //(+y.value() / maxYValue) * canvasHeight + "px";
                segment.style.backgroundColor = row.color().hexCode;

                segment.onmouseover = (e) => {
                    mod.controls.tooltip.show(row);
                };
                segment.onmouseout = (e) => {
                    mod.controls.tooltip.hide();
                };

                segment.onclick = (e) => {
                    /** @type{Spotfire.MarkingOperation} */
                    let mode = e.ctrlKey ? "Toggle" : "Replace";
                    if (e.shiftKey) {
                        rows.forEach((m) => m.mark(mode));
                    } else {
                        row.mark(mode);
                    }
                };

                bar.appendChild(segment);
            });

            return bar;
        }
    }