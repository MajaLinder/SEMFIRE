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
        mod.property<boolean>("showLineMarkers"),
        mod.property<boolean>("showCutOffLine")
    );

    reader.subscribe(generalErrorHandler(mod, 200)(onChange));

    async function onChange(
        dataView: DataView,
        windowSize: Size,
        categoryAxis: Axis,
        colorAxis: Axis,
        valueAxis: Axis,
        showCumulativeFrequencyLine: ModProperty<boolean>,
        showLineMarkers: ModProperty<boolean>,
        showCutOffLine: ModProperty<boolean>
    ) {
        let rootNode: DataViewHierarchyNode;
        rootNode = (await (await dataView.hierarchy(categoryAxisName))!.root()) as DataViewHierarchyNode;
        const hasColorExpression = !!colorAxis.parts.length && colorAxis.isCategorical;
        const { tooltip } = mod.controls;

        let pareto = transformData(rootNode, hasColorExpression);

        //validate that pareto data is vallid
        let warning: string | null = validateDataView(pareto);

        // If there is no data display error message
        if (!rootNode.children) {
            mod.controls.errorOverlay.show("Empty visualization!");
            return;
        }

        if (warning) {
            mod.controls.errorOverlay.show(warning);
            return;
        }

        let settings: Settings = {
            windowSize: windowSize,
            svg: undefined,
            clearMarking: dataView.clearMarking,
            tooltip: tooltip,
            style: {
                ticks: {
                    stroke: context.styling.scales.tick.stroke
                },

                background: {
                    color: context.styling.general.backgroundColor
                },

                label: {
                    fontFamily: context.styling.scales.font.fontFamily,
                    color: context.styling.scales.font.color,
                    fontStyle: context.styling.scales.font.fontStyle,
                    size: context.styling.scales.font.fontSize,
                    weight: context.styling.scales.font.fontWeight
                },

                lines: {
                    color: context.styling.scales.line.stroke,
                    weight: context.styling.scales.line.stroke
                },
                marking: { color: context.styling.scales.font.color },
                onMouseOverBox: {
                    strokeWidth: 0.5,
                    padding: 3,
                    stroke: context.styling.general.backgroundColor !== "#2A2A2A" ? "#000" : "#FFFF"
                },
                selectionBox: { strokeWidth: 0.5 },
                inbarsSeparatorWidth: 1.5
            }
        };

        renderPareto(pareto, settings);

        //for testing purposes
        //renderParetoAsTextInConsole(pareto, {} as Settings);
        context.signalRenderComplete();
        mod.controls.errorOverlay.hide();
    }
});

/**
 * Validate that all values are positive
 * @param pareto
 * @returns null if all values are positive, message if there are any negative values
 */
function validateDataView(pareto: Pareto): string | null {
    let warning: string | null = null;

    if (pareto.minValue < 0) {
        warning = "The Pareto chart can not contain any negative values";
    }

    return warning;
}

/**
 * Transform data into data model objects
 * @param rootNode - The hierarchy root.
 * @param hasColorExpression - Checks the color axis
 */
function transformData(rootNode: DataViewHierarchyNode, hasColorExpression: boolean): Pareto {
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
                row: row,
                color: row.color().hexCode,
                value: barValue,
                label: barLabel,
                index: barIndex,
                key: barKey,
                y0: y0,
                parentKey: leaf.key ?? "",
                mark: (event: any) => {
                    if (event != null && event.ctrlKey) {
                        console.log("toggle");
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
            key: leaf.key ?? "",
            isMarked: leaf.rows().some(function (b) {
                return b.isMarked() == true;
            }),
            mark: (event: any) => {
                if (event != null && event.ctrlKey) {
                    console.log("Toggle");
                    leaf.mark("ToggleOrAdd");
                    return;
                }
                leaf.mark();
            }
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
        noMarkOnLine: sortedStackedBars.every(function (l) {
            return l.isMarked == false;
        })
    };
    return pareto;
}

/**
 * subscribe callback wrapper with general error handling, row count check and an early return when the data has become invalid while fetching it.
 *
 * The only requirement is that the dataview is the first argument.
 * @param mod - The mod API, used to show error messages.
 * @param rowLimit - Optional row limit.
 */
export function generalErrorHandler<T extends (dataView: Spotfire.DataView, ...args: any) => any>(
    mod: Spotfire.Mod,
    rowLimit = 2000
): (a: T) => T {
    return function (callback: T) {
        return async function callbackWrapper(dataView: Spotfire.DataView, ...args: any) {
            try {
                const errors = await dataView.getErrors();
                if (errors.length > 0) {
                    mod.controls.errorOverlay.show(errors);
                    return;
                }
                /**
                 * User interaction while rows were fetched. Return early and respond to next subscribe callback.
                 */
                const allRows = await dataView.allRows();
                if (allRows == null) {
                    return;
                }

                await callback(dataView, ...args);
            } catch (e: any) {
                mod.controls.errorOverlay.show(e.message || "Something went wrong");
            }
        } as T;
    };
}
