import * as d3 from "d3";
import { Bar, Pareto } from "./pareto";
import { Settings } from "./settings";
export interface MarkingSettings {
    /**
     * Callback to clear the marking.
     */
    clearMarking(): void;

    /**
     * Marking callback that will be invoked for each marked element.
     * @param datum d3 Data object bound to the marked element.
     */
    mark(datum: unknown): void;

    /**
     * The CSS selector to use when filtering elements to mark.
     * @example Single class selector
     * ```
     * markingSelector: ".marker"
     * ```
     * @example Multiple classes
     * ```
     * markingSelector: ".marker, .sector"
     * ```
     */
    markingSelector: string;
}

//TODO: change this to work with the line. Drawing the rectangle should be reusable.
export function rectangularSelection(markingSettings: MarkingSettings) {
    function drawRectangle(x: number, y: number, w: number, h: number) {
        return "M" + [x, y] + " l" + [w, 0] + " l" + [0, h] + " l" + [-w, 0] + "z";
    }

    var d3svg = d3.select("svg#svg");

    // Removes previously drawn rectangle
    d3.select(".rectangle").remove();

    var rectangle = d3svg.append("path").attr("class", "rectangle").attr("visibility", "hidden");

    var startSelection = function (start: [number, number]) {
        rectangle.attr("d", drawRectangle(start[0], start[0], 0, 0)).attr("visibility", "visible");
    };

    var moveSelection = function (start: [number, number], moved: [number, number]) {
        rectangle.attr("d", drawRectangle(start[0], start[1], moved[0] - start[0], moved[1] - start[1]));
    };

    var endSelection = function (event: any) {
        rectangle.attr("visibility", "hidden");
        const selectionBox = rectangle.node()!.getBoundingClientRect();

        if (selectionBox.width == 0 && selectionBox.height == 0) {
            if (!event.ctrlKey) {
                markingSettings.clearMarking();
                return;
            }
            return;
        }
        const markedBars = d3svg.selectAll<SVGPathElement, unknown>(".in-bar").filter(partOfMarking);
        const markedCircles = d3svg.selectAll<SVGPathElement, unknown>(".line-circle").filter(partOfMarking);

        // Only bars are marked
        if (markedBars.size() > 0 && markedCircles.size() === 0) {
            markingSettings.clearMarking();
        }

        markedBars.each((n: any) => {
            (n as Bar).mark();
        });

        markedCircles.each((n: any) => {
            // TODO: mark line
            n.mark();
        });

        function partOfMarking(this: SVGPathElement) {
            //is part of marking if in-bar intersects selectionBox

            // box is the bars
            const box = this.getBoundingClientRect();

            //console.log(selectionBox);
            //this boxe's corners BL - botom left, BR - botom right, etc.
            let thisCorners = [
                [box.x, box.y],
                [box.x + box.width, box.y],
                [box.x, box.y + box.height],
                [box.x + box.width, box.y + box.height]
            ];

            // selection rectangle
            let selectionBoxCorners = [
                [selectionBox.x, selectionBox.y],
                [selectionBox.x + selectionBox.width, selectionBox.y],
                [selectionBox.x, selectionBox.y + selectionBox.height],
                [selectionBox.x + selectionBox.width, selectionBox.y + selectionBox.height]
            ];

            //check if any of the corners of this box is inside selectionBox
            let thisIntersectsSelection = false;
            thisCorners.forEach(
                (point) =>
                    (thisIntersectsSelection =
                        thisIntersectsSelection ||
                        pInsideR(point, selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height))
            );

            //check if selectionBox is contained by thisBox
            selectionBoxCorners.forEach(
                (point) =>
                    (thisIntersectsSelection =
                        thisIntersectsSelection || pInsideR(point, box.x, box.y, box.width, box.height))
            );

            // check if selectionBox goes through thisBox without any contained corner
            thisIntersectsSelection =
                thisIntersectsSelection ||
                linesIntersect(
                    selectionBox.y,
                    selectionBox.y + selectionBox.height,
                    selectionBox.x,
                    selectionBox.x + selectionBox.width,
                    box.y,
                    box.y + box.height,
                    box.x,
                    box.x + box.width
                );

            return thisIntersectsSelection;
        }

        /**
         * Check if point P(x, y) is inside rectangle R with rx, ry coordinates and w, h width and height
         */
        function pInsideR(point: number[], rx: number, ry: number, w: number, h: number) {
            return point[0] > rx && point[0] < rx + w && point[1] > ry && point[1] < ry + h;
        }

        /**
         * Check case when the rectangle goes through a bar without the corners inside
         */
        function linesIntersect(
            selectionBottomY: number,
            selectionTopY: number,
            selectionLeftX: number,
            selectionRightX: number,
            thisBottomY: number,
            thisTopY: number,
            thisLeftX: number,
            thisRightX: number
        ) {
            return (
                // checks if the rectangle goes through a bar horizontally
                (selectionBottomY < thisTopY &&
                    selectionBottomY > thisBottomY &&
                    selectionLeftX < thisLeftX &&
                    selectionRightX > thisRightX) ||
                // checks if the rectangle goes through a bar vertically
                (selectionLeftX < thisRightX &&
                    selectionLeftX > thisLeftX &&
                    selectionTopY > thisTopY &&
                    selectionBottomY < thisBottomY)
            );
        }
    };
    d3svg.on("mousedown", function (event: any, d) {
        if (event.which === 3) {
            return;
        }

        let subject = d3.select(window),
            start = d3.pointer(event);
        startSelection(start);
        subject
            .on("mousemove.rectangle", function (event: any, d) {
                moveSelection(start, d3.pointer(event, d3svg.node()));
            })
            // Hides the drawn rectangle when releasing the mouse button
            .on("mouseup.rectangle", function () {
                endSelection(event);
                subject.on("mousemove.rectangle", null).on("mouseup.rectangle", null);
            });
    });
}
