// here we define all settings that have an effect on how the pareto chart will be rendered and look like,

import { Tooltip } from "spotfire-api";

// for example: tick stroke width, tick length, etc
export interface Settings {
    svg?: undefined;
    clearMarking(): void;
    tooltip: Tooltip;
    windowSize: { width: number; height: number };
    style: {
        ticks: { stroke: string };
        label: { fontFamily: string; color: string; fontStyle: string; size: number; weight: string };
        lines: { weight: string; color: string };
        //font: { size: number; weight: string; style: string; color: string; fontFamily: string };
        marking: { color: string };
        background: { color: string };
        onMouseOverBox: { strokeWidth: number; padding: number; stroke: string };
        selectionBox: { strokeWidth: number };
        inbarsSeparatorWidth: number;
    };
}

/**
 * @param setting Setting data structure
 */

export function renderSettings(setting: Settings) {
    const setStyle = setting;

    const margin = { top: 20, left: 20, right: 20, bottom: 20 };

    // The position and size of the chart canvas.
    const canvas = {
        top: margin.top,
        left: margin.left,
        width: setStyle.windowSize.width - (margin.left + margin.right),
        height: setStyle.windowSize.height - (margin.top + margin.bottom)
    };
}
