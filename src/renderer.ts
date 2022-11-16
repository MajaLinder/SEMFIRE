
import { renderAxes } from "./axis";
import {Pareto} from "./pareto";
import {renderStackedBars} from "./stackedBars";

export interface Settings {
    //here you define all settings that have an effect on how the pareto chart will be rendered and look like, 
    //for example: tick stroke width, tick length, etc
}

/**
 * Draws pareto with the given settings
 * @param pareto - Pareto to write in console
 * @param settings - Settings that should be used
 */


    

export async function renderPareto(pareto: Pareto, settings: Settings) {
    
    renderStackedBars(pareto);
    renderAxes(pareto)
}

/**
 * Writes a textual representation of the pareto in debugging console
 * @param pareto - Pareto to write in console
 * @param settings - Settings that should be used
 */
export async function renderParetoAsTextInConsole(pareto: Pareto, settings: Settings) {
    pareto.stackedBars.forEach((p) => {
        console.log(p.label + " - " + p.totalValue + " (" + p.cumulativePercentage.toFixed(2)+ "%)"); 
        if(p.bars?.length > 1) {
            p.bars.forEach((bar) => {
                console.log("     " + bar.label + " - " + bar.value + " (" + bar.color + ")"); 
            });
        }
    });

    console.log("Max value: " + pareto.maxValue);
    console.log("Min value: " + pareto.minValue);

}

