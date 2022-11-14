import { Axis, DataView, DataViewHierarchyNode, DataViewRow, Mod, ModProperty, Size } from "spotfire-api";
//import * as d3 from "d3";
import { resources } from "./resources";
import { Pareto, StackedBar, Bar } from "./pareto";
import { Settings } from "./settings";
import { renderPareto, renderParetoAsTextInConsole } from "./renderer";

const categoryAxisName = "CategoryAxis";
const colorAxisName = "ColorAxis";
const valueAxisName = "ValueAxis";

window.Spotfire.initialize(async (mod) => {
    const context = mod.getRenderContext();

    const reader = mod.createReader(
        mod.visualization.data(),
        mod.windowSize(),
        mod.visualization.axis(categoryAxisName),
        mod.visualization.axis(colorAxisName),
        mod.visualization.axis(valueAxisName),
        mod.property<boolean>("showCumulativeFrequencyLine"),
        mod.property<boolean>("showLineMarkers"),

    );

    reader.subscribe(onChange);

    async function onChange(
        dataView: DataView, windowSize: Size, categoryAxis: Axis, colorAxis: Axis,
        valueAxis: Axis, showCumulativeFrequencyLine: ModProperty<boolean>, showLineMarkers: ModProperty<boolean>, 
    ) {
        let rootNode: DataViewHierarchyNode;
        rootNode = (await (await dataView.hierarchy(categoryAxisName))!.root()) as DataViewHierarchyNode;
        const hasColorExpression = !!colorAxis.parts.length && colorAxis.isCategorical;
        //validate data before transformation
        validateDataView(rootNode);

        //transform data into data model objects
        let unSortedStackedBars: StackedBar[] = rootNode!.leaves().map((leaf) => {
            let totalValue = 0;
            let bars: Bar[] = leaf.rows().map((row) => {
                let barValue = row.continuous(valueAxisName).value<number>() || 0;
                totalValue += barValue;
                let barLabel = hasColorExpression ? row.categorical(colorAxisName).formattedValue() : leaf.key;
                return {
                    color: row.color().hexCode, //to do: get the color automatically from color axis
                    value: barValue,
                    label: barLabel
                } as Bar
            })

            return {
                bars: bars,
                label: leaf.formattedPath(),
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
        let paretoGrandTotal = sortedStackedBars?.length ? sortedStackedBars[sortedStackedBars.length - 1].cumulativeValue : 0;
        sortedStackedBars.forEach(stackedBar => stackedBar.cumulativePercentage = 100 * stackedBar.cumulativeValue / paretoGrandTotal);

        let pareto: Pareto = {
            stackedBars: sortedStackedBars,
            maxValue: sortedStackedBars?.length ? sortedStackedBars[0].totalValue : 0,
            minValue: sortedStackedBars?.length ? sortedStackedBars[sortedStackedBars.length - 1].totalValue : 0,
            grandTotal: paretoGrandTotal
        } as Pareto

        let settings: Settings = {
            windowSize: windowSize,
            clearMarking: dataView.clearMarking,
            style: {

                ticks: {
                    stroke: context.styling.scales.line.stroke,
                },

                background: {
                    color: context.styling.general.backgroundColor },

                label: {
                    fontFamily: context.styling.general.font.fontFamily,
                    color: context.styling.general.font.color,
                    size: context.styling.general.font.fontSize,
                    style: context.styling.general.font.fontStyle,
                    weight: context.styling.general.font.fontWeight
                },

                lines: {
                    color: context.styling.scales.line.stroke, 
                    weight: context.styling.scales.line.stroke
                }
                

            },


        } as Settings


        //to do: render Pareto
        //when renderPareto method has been implemented it should be invoked here
        renderPareto(pareto, {} as Settings);

        //for testing purposes
        renderParetoAsTextInConsole(pareto, {} as Settings);

        context.signalRenderComplete();
    }
});

/**
 * Validate that no empty path element is followed by a value and that all values are positive.
 * @param rootNode - The hierarchy root.
 */
function validateDataView(rootNode: DataViewHierarchyNode): string[] {
    let warnings: string[] = [];
    let rows = rootNode.rows();

    //to do: validate data, check if there are negative values, or values outside some range, etc

    return warnings;
}