import * as d3 from "d3";

/**
 * @param {Spotfire.DataView} dataView
 */

export async function drawLine(dataView) {
    d3.selectAll("path").remove();
    d3.selectAll("g").remove();

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
    const dataset1 = createDataSet(finalData);

    var svg = d3.select("svg");
    const valueAxisHeight = document.querySelector("#svg");
    const valuePixels = valueAxisHeight.getBoundingClientRect();
    const categoryAxisWidth = document.querySelector("#svg");
    const categoryPixels = categoryAxisWidth.getBoundingClientRect();
    console.log(categoryPixels.width);
    console.log(valuePixels.height);
    var svg = d3.select("svg");
    // margin = 200,
    // width = svg.attr("width") - margin, //300
    // height = svg.attr("height") - margin //200

    // Step 4
    var xScale = d3
            .scaleLinear()
            .domain([0, maxValueWidth])
            .range([0, categoryPixels.width - 50]),
        yScale = d3
            .scaleLinear()
            .domain([0, maxValueHeight])
            .range([valuePixels.height - 50, 0]);

    var g = svg
        .append("g") //move bars
        .attr("transform", "translate(" + 20 + "," + 0 + ")");

    // Step 5
    //Title
    // svg.append("text")
    //     .attr("x", maxValueWidth / 2 + 100)
    //     .attr("y", 100)
    //     .attr("text-anchor", "middle")
    //     .style("font-family", "Helvetica")
    //     .style("font-size", 20)
    //     .text("Line Chart");

    // // X label
    // svg.append("text")
    //     .attr("x", maxValueWidth / 2 + 100)
    //     .attr("y", maxValueHeight - 15 + 150)
    //     .attr("text-anchor", "middle")
    //     .style("font-family", "Helvetica")
    //     .style("font-size", 12)
    //     .text("Independant");

    // // Y label
    // svg.append("text")
    //     .attr("text-anchor", "middle")
    //     .attr("transform", "translate(60," + maxValueHeight + ")rotate(-90)")
    //     .style("font-family", "Helvetica")
    //     .style("font-size", 12)
    //     .text("Dependant");

    // Step 6
    g.append("g")
        .attr("transform", "translate(0," + (valuePixels.height - 50) + ")")
        .call(d3.axisBottom(xScale));

    g.append("g").call(d3.axisLeft(yScale));
    g.append("g")
        .attr("transform", "translate(" + (categoryPixels.width - 50) + " ,0)")
        .call(d3.axisRight(yScale));

    // Step 7
    svg.append("g")
        .selectAll("dot")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d[0]);
        })
        .attr("cy", function (d) {
            return yScale(d[1]);
        })
        .attr("r", 3)
        .attr("transform", "translate(" + 10 + "," + 0 + ")") //moves dots
        .style("fill", "#CC0000");

    // Step 8
    var line = d3
        .line()
        .x(function (d) {
            return xScale(d[0]);
        })
        .y(function (d) {
            return yScale(d[1]);
        });
    //.curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(dataset1)
        .attr("class", "line")
        .attr("transform", "translate(" + 10 + "," + 0 + ")") //move lines
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
}
// var categoryScale = d3.scaleLinear().domain([0, maxValueWidth]).range([0, categoryPixels]),
//     valueScale = d3.scaleLinear().domain([0, maxValueHeight]).range([valuePixels, 0]);
// console.log(categoryScale(1));
// //var g = svg.append("g").attr("transform", "translate(" + 10 + "," + 100 + ")");
// var g = svg.append("g");
// g.append("g")
//     .attr("transform", "translate(0," + valuePixels + ")")
//     .call(d3.axisBottom(categoryScale));

// g.append("g").call(d3.axisLeft(valueScale));

// var line = d3
//     .line()
//     .x(function (d) {
//         return categoryScale(d[0]);
//     })
//     .y(function (d) {
//         return valueScale(d[1]);
//     })
//     .curve(d3.curveMonotoneX);

// svg.append("path")
//     .datum(dataset)
//     .attr("class", "line")
//     .attr("transform", "translate(" + 0 + "," + 0 + ")")
//     .attr("d", line)
//     .style("fill", "none")
//     .style("stroke", "#4916ea")
//     .style("stroke-width", "2");
