/*
 * Copyright © 2020. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */
import {calculateMaxYValue} from "./utility/methods";
import {renderBars} from "./stackedBars"
import {renderYScale} from "./yScale"
import {rendercolorScale} from "./colorAxis"
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
        mod.property("y-axis-mode"),
        mod.property("stacked-bars"),
        mod.visualization.axis("Y"),
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
     * @param {Spotfire.ModProperty<string>} yAxisMode
     * @param {Spotfire.ModProperty<boolean>} stackedBars
     * @param {Spotfire.Axis} yAxis
     */
    async function render(dataView, yAxisMode, stackedBars, yAxis) {
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
        let dataViewYAxis = await dataView.continuousAxis("Y");
        if (dataViewYAxis == null) {
            mod.controls.errorOverlay.show("No data on y axis.", "y");
            return;
        } else {
            mod.controls.errorOverlay.hide("y");
        }

        mod.controls.tooltip.hide();
        let xLeaves = xRoot.leaves();
        /**
         * Print out to document
         */
        let maxYValue = calculateMaxYValue(xLeaves, stackedBars);
        
        // TODO: look up this
        let colorHierarchy = await dataView.hierarchy("Color");
        let categoricalColorCount = colorHierarchy ? colorHierarchy.leafCount : 0;

        renderYScale(maxYValue, yAxis, yAxisMode, mod);
        rendercolorScale(maxYValue, yAxis, yAxisMode, mod);

        xLeaves.sort((a, b) => 
            Number(b.rows()[0].continuous("Y").value()) - Number(a.rows()[0].continuous("Y").value())
        );

        renderBars(xLeaves, categoricalColorCount, maxYValue, stackedBars, mod);

        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();
    }
});