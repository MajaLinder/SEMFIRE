import * as d3 from "d3";
import { line } from "d3";
import { Controls, ModProperty } from "spotfire/spotfire-api-1-2";

export function createScalePopout(
    controls: Controls,
    logistic: ModProperty<boolean>,
    linear: ModProperty<boolean>,
    popoutClosedEventEmitter: any
) {
    const { radioButton } = controls.popout.components;
    const { section } = controls.popout;

    const svg = d3.select("svg");
    const valueAxis = svg.select("#valueAxis");

    // TODO: change any to type
    valueAxis.on("click", function (d: any) {
        controls.popout.show(
            {
                x: d.x,
                y: d.y,
                autoClose: true,
                alignment: "Bottom",
                onChange: (event) => {
                    const { name, value } = event;
                    console.log(value);
                    switch (name) {
                        case linear.name:
                            linear.set(value);
                            console.log(linear);
                            break;
                        case logistic.name:
                            logistic.set(value);
                            break;
                    }
                    // name == logistic.name && logistic.set(value);
                    // name == linear.name && linear.set(value);
                },
                onClosed: () => {
                    popoutClosedEventEmitter.emit("popoutClosed");
                }
            },
            popoutContent
        );
    });
    /**
     * Popout content
     */
    const is = (property: ModProperty) => (value: any) => property.value() == value;
    console.log(is(logistic)(true));

    const popoutContent = () => [
        section({
            children: [
                radioButton({
                    name: logistic.name,
                    text: "Use logistic scale",
                    value: is(logistic)(true),
                    checked: is(logistic)(true)
                })
            ]
        }),
        section({
            children: [
                radioButton({
                    name: linear.name,
                    text: "Use linear scale",
                    value: true,
                    checked: is(linear)(true)
                })
            ]
        })
    ];
}
