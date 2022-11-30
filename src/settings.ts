
// here we define all settings that have an effect on how the pareto chart will be rendered and look like, 


// for example: tick stroke width, tick length, etc
export interface Settings {
    svg: undefined;
    clearMarking?(): void;
    windowSize: { width: number; height: number };
    style: {
        ticks: {stroke: string};
        label: {fontFamily: string, color: string, fontStyle: string};
        lines: {weight: string, color: string};
        font: { size: number; weight: string; style: string; color: string; fontFamily: string };
        marking: { color: string };
        background: { color: string };
    };
}

/**
 * @param setting Setting data structure
 */


export function renderSettings(setting: Settings) {

    const setStyle = setting;

    const margin = { "top": 20, "left": 20, "right": 20, "bottom": 20 };

    // The position and size of the chart canvas.
    const canvas = { 
        top: margin.top,
        left: margin.left,
        width: setStyle.windowSize.width - (margin.left + margin.right),
        height: setStyle.windowSize.height - (margin.top + margin.bottom)
    };
}
