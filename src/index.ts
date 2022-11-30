import { Axis, DataView, DataViewHierarchyNode, DataViewRow, Mod, ModProperty, Size } from "spotfire-api";
import { resources } from "./resources";
import { Pareto, StackedBar, Bar } from "./pareto";
import { Settings } from "./settings";
import { renderPareto, renderParetoAsTextInConsole } from "./renderer";

const categoryAxisName = "Category Axis";
const colorAxisName = "Color";
const valueAxisName = "Value Axis";

window.Spotfire.initialize(async (mod) => {
    const context = mod.getRenderContext();

    const reader = mod.createReader(
        mod.visualization.data(),
        mod.windowSize(),
        mod.visualization.axis(categoryAxisName),
        mod.visualization.axis(colorAxisName),
        mod.visualization.axis(valueAxisName),
        mod.property<boolean>("showCumulativeFrequencyLine"),
        mod.property<boolean>("showLineMarkers")
    );

    reader.subscribe(onChange);

    async function onChange(
        dataView: DataView,
        windowSize: Size,
        categoryAxis: Axis,
        colorAxis: Axis,
        valueAxis: Axis,
        showCumulativeFrequencyLine: ModProperty<boolean>,
        showLineMarkers: ModProperty<boolean>
    ) {
        let rootNode: DataViewHierarchyNode;
        rootNode = (await (await dataView.hierarchy(categoryAxisName))!.root()) as DataViewHierarchyNode;
        const hasColorExpression = !!colorAxis.parts.length && colorAxis.isCategorical;

        let colorRootNode: DataViewHierarchyNode = (await (await dataView.hierarchy(
            colorAxisName
        ))!.root()) as DataViewHierarchyNode;

        //validate data before transformation
        validateDataView(rootNode);

        let pareto = transformData(rootNode, colorRootNode, hasColorExpression);

        let settings: Settings = {
            windowSize: windowSize,
            clearMarking: dataView.clearMarking,
            style: {
                ticks: {
                    stroke: context.styling.scales.line.stroke
                },

                background: {
                    color: context.styling.general.backgroundColor
                },

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
                },
                marking: { color: context.styling.scales.font.color }
            }
        };

        //to do: render Pareto
        //when renderPareto method has been implemented it should be invoked here

        renderPareto(pareto, settings);

        //for testing purposes
        //renderParetoAsTextInConsole(pareto, {} as Settings);

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

/**
 * Transform data into data model objects
 * @param rootNode - The hierarchy root.
 * @param hasColorExpression - Checks the color axis
 */
function transformData(
    rootNode: DataViewHierarchyNode,
    colorRootNode: DataViewHierarchyNode,
    hasColorExpression: boolean
): Pareto {
    let tempColorIndices = hasColorExpression
        ? colorRootNode.rows().map((x) => x.leafNode(colorAxisName)?.leafIndex ?? 0)
        : [0];
    let tempColorRange = hasColorExpression
        ? colorRootNode.rows().map((x) => x.color().hexCode)
        : [colorRootNode.rows()[0].color().hexCode];
    let colorIndices: number[] = tempColorIndices.filter((item, index) => tempColorIndices.indexOf(item) === index);
    let colorRange: string[] = tempColorRange.filter((item, index) => tempColorRange.indexOf(item) === index);

    let unSortedStackedBars: StackedBar[] = rootNode!.leaves().map((leaf) => {
        let totalValue = 0;
        let bars: Bar[] = leaf.rows().map((row) => {
            let barValue = row.continuous(valueAxisName).value<number>() || 0;
            totalValue += barValue;
            let barLabel = hasColorExpression ? row.categorical(colorAxisName).formattedValue() : leaf.formattedValue();
            let barIndex = hasColorExpression ? row.leafNode(colorAxisName)?.leafIndex ?? -1 : 0;
            let barKey = hasColorExpression ? row.leafNode(colorAxisName)?.key ?? "" : "All values";
            return {
                color: row.color().hexCode,
                value: barValue,
                label: barLabel,
                index: barIndex,
                key: barKey
            };
        });
        let stackedBar: StackedBar = {
            position: -1, //to be filled in when array of StackedBar's gets sorted
            bars: bars,
            label: leaf.formattedPath(),
            index: leaf.leafIndex ?? -1,
            totalValue: totalValue,
            cumulativeValue: 0,
            cumulativePercentage: 0,
            key: leaf.key ?? "",
            mark: leaf.mark
        };
        return stackedBar;
    });

    let sortedStackedBars: StackedBar[] = unSortedStackedBars.sort((a, b) => {
        return b.totalValue - a.totalValue;
    });

    let prevCumulative = 0;
    let pos = 0;
    sortedStackedBars.forEach((stackedBar) => {
        stackedBar.cumulativeValue += prevCumulative + stackedBar.totalValue;
        stackedBar.cumulativePercentage = (100 * stackedBar.cumulativeValue) / paretoGrandTotal;
        prevCumulative = stackedBar.cumulativeValue;
        stackedBar.position = pos;
        pos++;
    });
    let paretoGrandTotal = sortedStackedBars?.length
        ? sortedStackedBars[sortedStackedBars.length - 1].cumulativeValue
        : 0;
    sortedStackedBars.forEach(
        (stackedBar) => (stackedBar.cumulativePercentage = (100 * stackedBar.cumulativeValue) / paretoGrandTotal)
    );

    let pareto: Pareto = {
        stackedBars: sortedStackedBars,
        maxValue: sortedStackedBars?.length ? sortedStackedBars[0].totalValue : 0,
        minValue: sortedStackedBars?.length ? sortedStackedBars[sortedStackedBars.length - 1].totalValue : 0,
        grandTotal: paretoGrandTotal,
        colorIndices: colorIndices,
        colorRange: colorRange
    };
    return pareto;
}
