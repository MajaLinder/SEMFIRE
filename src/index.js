/*
 * Copyright © 2020. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */
import { calculateMaxValue, sortDescending } from "./utility/methods";
import { renderBars } from "./stackedBars";
import { renderValueScale } from "./valueAxis";
import { renderPercentage } from "./percentage";
import { renderXScale } from "./xAxis";
import { drawLine } from "./cumulativeLine";
//@ts-check - Get type warnings from the TypeScript language server. Remove if not wanted.

/**
 * Get access to the Spotfire Mod API by providing a callback to the initialize method.
 * @param {Spotfire.Mod} mod - mod api
 */
Spotfire.initialize(async (mod) => {
    const context = mod.getRenderContext();

    /**
     * Create the read function.
     */
    const reader = mod.createReader(
        mod.visualization.data(),
        mod.property("value-axis-mode"),
        mod.property("stacked-bars"),
        mod.visualization.axis("Value"),
        mod.windowSize()
    );

    /**
     * Store the context.
     */

    /**
     * Initiate the read loop
     */
    reader.subscribe(render);

    /**
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.ModProperty<string>} valueAxisMode
     * @param {Spotfire.ModProperty<boolean>} stackedBars
     * @param {Spotfire.Axis} valueAxis
     */
    async function render(dataView, valueAxisMode, stackedBars, valueAxis) {
        /**
         * Check the data view for errors
         */
        let errors = await dataView.getErrors();
        if (errors.length > 0) {
            // Showing an error overlay will hide the mod iframe.
            // Clear the mod content here to avoid flickering effect of
            // an old configuration when next valid data view is received.
            mod.controls.errorOverlay.show(errors, "dataView");
            return;
        }
        mod.controls.errorOverlay.hide("dataView");

        /**
         * Get the hierarchy of the categorical X-axis.
         */
        let xHierarchy = await dataView.hierarchy("X");
        let xRoot = await xHierarchy.root();

        if (xRoot == null) {
            // User interaction caused the data view to expire.
            // Don't clear the mod content here to avoid flickering.
            return;
        }
        let dataViewValueAxis = await dataView.continuousAxis("Value");
        if (dataViewValueAxis == null) {
            mod.controls.errorOverlay.show("No data on value axis.", "Value");
            return;
        } else {
            mod.controls.errorOverlay.hide("Value");
        }

        mod.controls.tooltip.hide();
        let xLeaves = xRoot.leaves();

        /**
         * Print out to document
         */
        let maxValue = calculateMaxValue(xLeaves, stackedBars);

        let colorHierarchy = await dataView.hierarchy("Color");
        let categoricalColorCount = colorHierarchy ? colorHierarchy.leafCount : 0;

        sortDescending(xLeaves);
        renderValueScale(maxValue, valueAxis, valueAxisMode, mod);
        renderPercentage(maxValue, valueAxis, valueAxisMode, mod);
        renderBars(xLeaves, categoricalColorCount, maxValue, stackedBars);
        renderXScale(xLeaves, mod);
        drawLine(dataView);
        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();
    }
});
