import { Axis, DataView, DataViewHierarchyNode, ModProperty, Size } from "spotfire-api";
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

        // TODO: error handling for if the value and category axis contains no value
        let colorAxisCategoryName = hasColorExpression ? colorAxis.parts[0].displayName : null,
            valueAxisCategoryName = valueAxis.parts.length === 1 ? valueAxis.parts[0].displayName : null,
            categoryAxisCategoryName = categoryAxis.parts.length === 1 ? categoryAxis.parts[0].displayName : null;

        //validate data before transformation
        validateDataView(rootNode);
        const { tooltip } = mod.controls;

        let pareto = transformData(
            rootNode,
            hasColorExpression,
            colorAxisCategoryName,
            valueAxisCategoryName,
            categoryAxisCategoryName
        );

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
                marking: { color: context.styling.scales.font.color },
                onMouseOverBox: { strokeWidth: 0.5, padding: 3 },
                selectionBox: { strokeWidth: 0.5 },
                inbarsSeparatorWidth: 1.5
            }
        };

        renderPareto(pareto, settings, tooltip);

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
    hasColorExpression: boolean,
    colorAxisCategoryName: string | null,
    valueAxisCategoryName: string | null,
    categoryAxisCategoryName: string | null
): Pareto {
    let unSortedStackedBars: StackedBar[] = rootNode!.leaves().map((leaf) => {
        let totalValue = 0;
        let bars: Bar[] = leaf.rows().map((row) => {
            let barValue = row.continuous(valueAxisName).value<number>() || 0;
            let y0 = 0;
            totalValue += barValue;
            let barLabel = hasColorExpression ? row.categorical(colorAxisName).formattedValue() : leaf.formattedValue();
            let barIndex = hasColorExpression ? row.leafNode(colorAxisName)?.leafIndex ?? -1 : 0;
            let barKey = hasColorExpression ? row.leafNode(colorAxisName)?.key ?? "" : "All values";

            return {
                color: row.color().hexCode,
                value: barValue,
                label: barLabel,
                index: barIndex,
                key: barKey,
                y0: y0,
                parentKey: leaf.key ?? "",
                parentLabel: leaf.formattedPath(),
                mark: (event: any) => {
                    if (event.ctrlKey) {
                        row.mark("ToggleOrAdd");
                        return;
                    }
                    row.mark();
                },
                isMarked: row.isMarked()
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
            key: leaf.key ?? ""
        };

        //fill in y0 coordinates of bars in a reverse order to match the coloring order
        let previousSum = 0;
        stackedBar.bars.forEach((b) => {
            b.y0 = stackedBar.totalValue - previousSum - b.value;
            previousSum += b.value;
        });

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
        colorByAxisName: colorAxisCategoryName,
        valueAxisName: valueAxisCategoryName,
        categoryAxisName: categoryAxisCategoryName
    };
    return pareto;
}
