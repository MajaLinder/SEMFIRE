import { Axis, DataView, DataViewHierarchyNode, DataViewRow, Mod, ModProperty, Size } from "spotfire-api";
//import * as d3 from "d3";
import { resources } from "./resources";
import {Pareto, StackedBar, Bar } from "./pareto";
import { renderPareto } from "./renderer";

const hierarchyAxisName = "HierarchyAxis";
const colorAxisName = "Color";
const valueAxisName = "ValueAxis";
const percentageAxisName = "PercentageAxis";

window.Spotfire.initialize(async (mod) => {
    const context = mod.getRenderContext();

    const reader = mod.createReader(
        mod.visualization.data(),
        mod.windowSize(),
        mod.visualization.axis(hierarchyAxisName),
        mod.visualization.axis(colorAxisName),
        mod.visualization.axis(valueAxisName),
        mod.visualization.axis(percentageAxisName),
        mod.property<boolean>("showCumulativeFrequencyLine"),
        mod.property<boolean>("showLineMarkers")
    );

    reader.subscribe(onChange);

    async function onChange(
        dataView: DataView, windowSize: Size, hierarchyAxis: Axis, colorAxis: Axis,
        valueAxis: Axis, percentageAxis: Axis, showCumulativeFrequencyLine: ModProperty<boolean>, showLineMarkers: ModProperty<boolean>
    ) 
    {
        let rootNode: DataViewHierarchyNode;
        rootNode = (await (await dataView.hierarchy(hierarchyAxisName))!.root()) as DataViewHierarchyNode;

        //validate data before transformation
        validateDataView(rootNode);

        //transform data into data model objects
        let unSortedStackedBars: StackedBar[] = rootNode!.leaves().map((leaf) => {
            let totalValue = 0; 
            let bars: Bar[] = leaf.rows().map((row) => {
                let barValue = row.continuous(valueAxisName).value<number>() || 0;
                totalValue += barValue;
                return {
                    color: "red", //to do: get the color automatically from color axis
                    value: barValue,
                } as Bar
            })
            return {
                bars: bars,
                label: leaf.key,
                totalValue: totalValue,
                cumulativeValue: 0
            } as StackedBar
        });

        let sortedStackedBars: StackedBar[] = unSortedStackedBars.sort((a, b) => {
            return b.totalValue - a.totalValue;
        });

        let prevCumulative = 0;
        
        sortedStackedBars.forEach((stackedBar) => {
            stackedBar.cumulativeValue += prevCumulative + stackedBar.totalValue;
            stackedBar.cumulativePercentage = 100 * stackedBar.cumulativeValue / paretoGrandTotal;
            prevCumulative = stackedBar.cumulativeValue;
        });
        let paretoGrandTotal = sortedStackedBars?.length? sortedStackedBars[sortedStackedBars.length - 1].cumulativeValue: 0;
        sortedStackedBars.forEach(stackedBar => stackedBar.cumulativePercentage = 100 * stackedBar.cumulativeValue / paretoGrandTotal);

        let pareto: Pareto = {
            stackedBars: sortedStackedBars,
            maxValue: sortedStackedBars?.length? sortedStackedBars[0].totalValue: 0,
            minValue: sortedStackedBars?.length? sortedStackedBars[sortedStackedBars.length - 1].totalValue: 0,
            grandTotal: paretoGrandTotal
        } as Pareto

        //to do: render Pareto
        pareto.stackedBars.forEach((p) => {
            console.log(p.label + " - " + p.totalValue + " (" + p.cumulativePercentage.toFixed(2)+ "%)");
        });
   
        console.log("Max value: " + pareto.maxValue);
        console.log("Min value: " + pareto.minValue);


        //when renderPareto method has been implemented it should be invoked here
        //renderPareto(paret, settings);


        context.signalRenderComplete();
    }
});

/**
 * Validate that no empty path element is followed by a value and that all values are positive.
 * @param rootNode - The hierarchy root.
 * @param warnings - The warnings array
 */
 function validateDataView(rootNode: DataViewHierarchyNode) {
    let warnings: string[] = [];
    let rows = rootNode.rows();

    //validate data, check if there are negative values, or values outside some range, etc

    return warnings;
}