import * as d3 from "d3"

/**
 * Render all bars on the canvas div.
 * @param {Spotfire.DataView} dataView
 */

export async function line(dataView) {

    d3.selectAll('path').remove();

    console.log(dataView)



    const allval = await dataView.allRows();
    // const pp = dataView;

    // console.log(pp)
    console.log(allval)
    let cval = [];
    // console.log(allval);
    for (let i of allval) {
        const val = Object.values(i);
        cval.push(val[0][2]);
        cval.sort((a, b) => { return b - a })
    }
    console.log(cval);

    // for (let i of cval) {
    //     finalval.push(i[2])
    //     finalval.sort((a, b) => { return a - b })
    // }
    // console.log(pp)
    let j = 0;
    for (let i of await dataView.allRows()) {
        Object.values(i)[0][2] = cval[j]
        j++
    }


    const cumal = cval.reduce((pre, curr) => { return pre + curr })

    console.log(cumal)
    function calpercantges(cval, cumal) {
        let percentages = [];
        for (let i of cval) {
            percentages.push(parseFloat(((i * 100) / cumal).toFixed(2)))
        }
        return percentages;
    };

    const final_percantag = calpercantges(cval, cumal);

    function calcValOfPercantages(cval, final_percantag) {
        let val = [];
        let secval = [0]; //this name has to change 
        for (let i of final_percantag) {
            val.push(parseFloat(((i * cval[0]) / 100).toFixed(2)))
        }
        for (let i = 0; i < val.length; i++) {
            secval.push(parseFloat((val[i] + secval[i]).toFixed(2)))
        }
        console.log(val)
        secval.shift();
        return secval;
    };
    const fi = calcValOfPercantages(cval, final_percantag)
    const maxValueHeight = Math.max(...fi);
    const maxValueWidth = fi.length;



    function createDataSet(a) {
        const last = [];
        for (let i = 0; i < a.length; i++) {
            const ar = [];
            ar.push(i + 1)
                ; ar.push(a[i]);
            last.push(ar);
        };
        return last
    };
    const h = createDataSet(fi)
    console.log(h);


    //====================================================================//
    var dataset1 = h;

    // [[1, 3.61],
    // [2, 6.99], [3, 9.69],
    // [4, 11.94],
    // [5, 13.97],
    // [6, 15.1],
    // [7, 16]]



    // Step 3
    var svg = d3.select("svg")
    // margin = 200,
    // width = "100 % ", //300
    // height = "100 % " //200
    const yAxisHeight = document.querySelector('#y-axis');
    const yPixels = yAxisHeight.offsetHeight;
    const xAxisWidth = document.querySelector('#x-axis');
    const xPixels = xAxisWidth.offsetWidth
    console.log(xAxisWidth.offsetWidth)
    console.log(yAxisHeight.offsetHeight)

    // Step 4
    var xScale = d3.scaleLinear().domain([0, maxValueWidth]).range([0, xPixels]),
        yScale = d3.scaleLinear().domain([0, maxValueHeight]).range([yPixels, 0]);
    console.log(xScale(1))
    var g = svg.append("g")
        .attr("transform", "translate(" + 10 + "," + 100 + ")");

    var line = d3.line()
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); })
        .curve(d3.curveMonotoneX)



    svg.append("path")
        .datum(dataset1)
        .attr("class", "line")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
}