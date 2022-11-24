// @ts-ignore
import * as d3 from "d3";

export interface Pareto {
    /** A single bar */
    stackedBars: StackedBar[]; 
    /** The largest value among bars */
    maxValue: number;
    /** The smallest value among bars */
    minValue: number;
    /** sum of all bar values */
    grandTotal: number;
}

/**
 * A collection of bars composing one stacked bar
 */
export interface StackedBar {
    position?: number; //zero-based position in the sorted array of StackedBar's
    bars: Bar[];
    totalValue: number;
    label: string;
    index: number;
    cumulativeValue: number; //cumulative value in the sorted array of stacked bars
    cumulativePercentage?: number
}
/** A sector of a bar */
export interface Bar {
    value: number;
    label: string;
    index: number;
    color: string;
}