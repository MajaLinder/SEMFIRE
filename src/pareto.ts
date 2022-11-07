// @ts-ignore
import * as d3 from "d3";

export interface Pareto {
    stackedBars: StackedBar[];
    maxValue: number;
    minValue: number;
    grandTotal: number;
}

/**
 * A collection of bars composing one stacked bar
 */
export interface StackedBar {
    position: number; //zero-based position in the sorted array of StackedBar's
    bars: Bar[];
    totalValue: number;
    label: string;
    cumulativeValue: number; //cumulative value in the sorted array of stacked bars
    cumulativePercentage: number
}

export interface Bar {
    value: number;
    label: string;
    color: string;
}