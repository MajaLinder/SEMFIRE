import {createDiv} from "./utility/methods"
import {sumValue} from "./utility/methods"
import * as d3 from "d3";

    
    /**
     * we will need: 
     * height, width, array of dataset values and categories
     */

    export function renderBars(){

        // Taken and modified from an example: https://objectcomputing.com/resources/publications/sett/august-2020-mastering-d3-basics
        // Later these will be adjusted to make room
        // for a vertical and horizontal axis.
        //TODO: what margin and padding do we need?
        const BOTTOM_PADDING = 0;
        const LEFT_PADDING = 0;
        const RIGHT_PADDING = 0;
        const TOP_PADDING = 0;
        
        // Full size of the svg element.
        //TODO: change to use d3 or dataTransformation/api instead of queryselector. Look into 
        const VALUEHEIGHT = document.querySelector("#value-axis");
        const CATEGORICALWIDTH = document.querySelector("#category-axis");
        const HEIGHT = VALUEHEIGHT.offsetHeight
        const WIDTH = CATEGORICALWIDTH.offsetWidth;

        // Size that can be used for the bars.
        const usableHeight = HEIGHT - TOP_PADDING - BOTTOM_PADDING;
        const usableWidth = WIDTH - LEFT_PADDING - RIGHT_PADDING;
        
        // Random data will be selected from this array.
        // TODO: change to datatransformation 
        const data = [
        {category: 'apple', value: 10},
        {category: 'banana', value: 9},
        {category: 'cherry', value: 8},
        {category: 'date', value: 7},
        ];
        
        let barPadding, barWidth, xScale, yScale;
        
        // TODO: use styling for this 
        // This is used to select bar colors based on their value.
        const colorScale = d3.scaleOrdinal(d3.schemePaired); // 12 colors
        
        
        // This updates the attributes of an SVG rect element
        // that represents a bar.
        function updateRect(rect) {
        rect
            // TODO: modify: "Each fruit will keep the same color as its value changes."
            .attr('fill', d => colorScale(d.value))
            .attr('width', barWidth - barPadding * 2)
            .attr('height', d => usableHeight - yScale(d.value))
            .attr('x', barPadding)
            .attr('y', d => TOP_PADDING + yScale(d.value));
        }
        
        // TODO: remove 
        // This updates the bar chart with random data.
        function updateData() {
   
        
        // Calculate padding on sides of bars based on # of bars.
        barPadding = Math.ceil(30 / data.length);
        
        // Calculate the width of each bar based on # of bars.
        barWidth = usableWidth / data.length;
        
        // TODO: look into how to use scales 
        // Create a scale to map data index values to x coordinates.
        // This is a function that takes a value in the "domain"
        // and returns a value in the "range".
        xScale = d3
            .scaleLinear()
            .domain([0, data.length])
            .range([LEFT_PADDING, LEFT_PADDING + usableWidth]);
        
        // Create a scale to map data value values to y coordinates.
        // The range is flipped to account for
        // the SVG origin being in the upper left corner.
        // Like xScale, this is a function that takes a value in the "domain"
        // and returns a value in the "range".
        // The d3.max function computes the largest data value in a given array
        // where values are computed by the 2nd argument function.
        const max = d3.max(data, d => d.value);
        yScale = d3.scaleLinear().domain([0, max]).range([usableHeight, 0]);
        
        // Create a D3 selection object that represents the svg element
        // and set the size of the svg element.
        const svg = d3.select('#svg').attr('width', WIDTH).attr('height', HEIGHT);
        
        // This is the most critical part to understand!
        // You learned about about selections and the general update pattern
        // in the previous section.
        const groups = svg
            .selectAll('.bar')
            .data(data, d => d.category)
            .join(enter => {
            // Create a new SVG group element for each placeholder
            // to represent a new bar.
            // For now the only thing in each group will be a rect element,
            // but later we will add a text element to display the value.
            const groups = enter.append('g').attr('class', 'bar');
        
            // Create a new SVG rect element for each group.
            groups
                .append('rect')
                .attr('height', 0)
                .attr('y', TOP_PADDING + usableHeight);
        
            return groups;
            });
        
        // The join method call above returns a selection that combines
        // the update and enter sub-selections into its update selection.
        // This allows operations needed on elements in both
        // to be performed on the new selection.
        
        // Translate the groups for each bar to their
        // appropriate x coordinate based on its index.
        groups.attr('transform', (_, i) => `translate(${xScale(i)}, 0)`);
        
        // Update all the rect elements using their newly associated data.
        updateRect(groups.select('rect'));
        }
        
        // Render the first version of the chart.
        updateData();
    }


//     /**
//      * Render all bars on the stackedBars div.
//      * @param {Spotfire.DataView} dataView
//      * @param {Spotfire.DataViewHierarchyNode[]} xLeafNodes
//      * @param {number} maxValue
//      * @param {Spotfire.ModProperty<boolean>} stackedBars
//      */
//      export function renderBars(xLeafNodes, categoricalColorCount, maxValue, stackedBars) {
//         const stackedBarsDiv = document.getElementById("stackedBars");
//         stackedBarsDiv.innerHTML = "";

//         const stackedBarsHeight = stackedBarsDiv.offsetHeight;

//         xLeafNodes.forEach((leafNode) => stackedBarsDiv.appendChild(renderBar(leafNode)));

//         /**
//          * Render bars/segments for a single category axis node.
//          * @param {Spotfire.DataViewHierarchyNode} xLeafNode
//          */
//         function renderBar(xLeafNode) {
//             let fragment = document.createDocumentFragment();
//             let rows = xLeafNode.rows();

//             if (stackedBars.value() && categoricalColorCount > 1) {
//                 // Render bars side by side. We need to add one bar per color to
//                 // keep all groups equally wide. So we create a sparse array where
//                 // we store the rows per color index, and render a bar for each
//                 // element in the array.
//                 let bars = new Array(categoricalColorCount).fill(null);
//                 rows.forEach((row) => {
//                     let colorValue = row.categorical("Color");
//                     bars[colorValue.leafIndex] = row;
//                 });

//                 bars.forEach((row) => {
//                     fragment.appendChild(renderStackedBar(xLeafNode, row ? [row] : []));
//                 });
//             } else {
//                 fragment.appendChild(renderStackedBar(rows));
//             } 

//             return fragment;
//         }

//         /**
//          * Render a stacked bar in the bar chart from a set of source rows.
//          * @param {Spotfire.DataViewHierarchyNode} xLeafNode
//          * @param {Spotfire.DataViewRow[]} rows
//          */
//         function renderStackedBar(rows) {
//             let bar = createDiv("bar");

//             let totalBarValue = sumValue(rows, "Value");
//             bar.style.height = Math.round((totalBarValue / maxValue) * stackedBarsHeight) + "px";

//             rows.forEach((row) => {
//                 let value = row.continuous("Value");
//                 if (value.value() === null) {
//                     return;
//                 }

//                 let segment = createDiv("segment");
//                 segment.style.height = (+value.value() / maxValue) * stackedBarsHeight + "px";
//                 segment.style.backgroundColor = row.color().hexCode;

//                 bar.appendChild(segment);
//             });

//             return bar;
//         }
//     }
//      