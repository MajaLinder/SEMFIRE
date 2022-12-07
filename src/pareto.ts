// @ts-ignore
import * as d3 from "d3";
import { MarkingOperation } from "spotfire-api";

export interface Pareto {
    /** A single bar */
    stackedBars: StackedBar[];
    /** The largest value among bars */
    maxValue: number;
    /** The smallest value among bars */
    minValue: number;
    /** sum of all bar values */
    grandTotal: number;
    /* What category the bars belong to */
    categoryAxisName: string | null;
    valueAxisName: string | null;
    colorByAxisName: string | null;
}

/**
 * A collection of bars composing one stacked bar
 */
export interface StackedBar {
    position: number; //zero-based position in the sorted array of StackedBar's
    bars: Bar[];
    totalValue: number;
    label: string;
    index: number;
    cumulativeValue: number; //cumulative value in the sorted array of stacked bars
    cumulativePercentage: number;
    key: string;
}
/** A sector of a bar */
export interface Bar {
    value: number;
    label: string;
    index: number;
    color: string;
    key: string;
    parentLabel: string;
    parentKey: string;
    /** y coordinate of the top-left corner of this in-bar */
    y0: number;
    mark(operation?: MarkingOperation | undefined): void;
}
