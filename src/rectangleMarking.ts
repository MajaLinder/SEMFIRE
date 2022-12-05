import * as d3 from "d3";

export function createRectangle() {
    function drawRectangle(x: number, y: number, w: number, h: number) {
        return "M" + [x, y] + " l" + [w, 0] + " l" + [0, h] + " l" + [-w, 0] + "z";
    }

    var d3svg = d3.select("svg");

    // Removes previously drawn rectangle
    d3.select(".rectangle").remove();

    var rectangle = d3svg.append("path").attr("class", "rectangle").attr("visibility", "hidden");

    var startSelection = function (start: [number, number]) {
        rectangle.attr("d", drawRectangle(start[0], start[0], 0, 0)).attr("visibility", "visible");
    };

    var moveSelection = function (start: [number, number], moved: [number, number]) {
        rectangle.attr("d", drawRectangle(start[0], start[1], moved[0] - start[0], moved[1] - start[1]));
    };

    var endSelection = function () {
        rectangle.attr("visibility", "hidden");
    };

    d3svg.on("mousedown", function (this: any) {
        if (d3.event.which === 3) {
            return;
        }

        let subject = d3.select(window),
            start = d3.mouse(this);
        startSelection(start);
        subject
            .on("mousemove.rectangle", function () {
                moveSelection(start, d3.mouse(d3svg.node() as any));
            })
            // Hides the drawn rectangle when releasing the mouse button
            .on("mouseup.rectangle", function () {
                endSelection();
                subject.on("mousemove.rectangle", null).on("mouseup.rectangle", null);
            });
    });
}
