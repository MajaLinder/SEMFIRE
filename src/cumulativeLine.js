import * as d3 from "d3";

/**
 * @param {Spotfire.DataView} dataView
 */

export async function drawLine(dataView) {
    d3.selectAll("path").remove();

    console.log(dataView);

    const allValues = await dataView.allRows();

    let calculatedValue = [];

    for (let i of allValues) {
        const val = Object.values(i);
        calculatedValue.push(val[0][2]);
        calculatedValue.sort((a, b) => {
            return b - a;
        });
    }

    let j = 0;
    for (let i of await dataView.allRows()) {
        Object.values(i)[0][2] = calculatedValue[j];
        j++;
    }

    const cumulativeValue = calculatedValue.reduce((pre, curr) => {
        return pre + curr;
    });

    console.log(cumulativeValue);
    function calpercantges(calculatedValue, cumulativeValue) {
        let percentages = [];
        for (let i of calculatedValue) {
            percentages.push(parseFloat(((i * 100) / cumulativeValue).toFixed(2)));
        }
        return percentages;
    }

    const cumulativePercentage = calpercantges(calculatedValue, cumulativeValue);

    function calcValOfPercantages(calculatedValue, cumulativePercentage) {
        let mapedValue = [];
        let mapedPercentage = [0];
        for (let i of cumulativePercentage) {
            mapedValue.push(parseFloat(((i * calculatedValue[0]) / 100).toFixed(2)));
        }
        for (let i = 0; i < mapedValue.length; i++) {
            mapedPercentage.push(parseFloat((mapedValue[i] + mapedPercentage[i]).toFixed(2)));
        }

        mapedPercentage.shift();
        return mapedPercentage;
    }
    const finalData = calcValOfPercantages(calculatedValue, cumulativePercentage);
    const maxValueHeight = Math.max(...finalData);
    const maxValueWidth = finalData.length;

    function createDataSet(data) {
        const dataSet = [];
        for (let i = 0; i < data.length; i++) {
            const ar = [];
            ar.push(i + 1);
            ar.push(data[i]);
            dataSet.push(ar);
        }
        return dataSet;
    }
    const dataSet = createDataSet(finalData);

    var svg = d3.select("svg");
    const valueAxisHeight = document.querySelector("#y-axis");
    const valuePixels = valueAxisHeight.offsetHeight;
    const xAxisWidth = document.querySelector("#x-axis");
    const xPixels = xAxisWidth.offsetWidth;

    var xScale = d3.scaleLinear().domain([0, maxValueWidth]).range([0, xPixels]),
        valueScale = d3.scaleLinear().domain([0, maxValueHeight]).range([valuePixels, 0]);
    console.log(xScale(1));
    var g = svg.append("g").attr("transform", "translate(" + 10 + "," + 100 + ")");

    var line = d3
        .line()
        .x(function (d) {
            return xScale(d[0]);
        })
        .y(function (d) {
            return valueScale(d[1]);
        })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(dataSet)
        .attr("class", "line")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#4916ea")
        .style("stroke-width", "2");
}
