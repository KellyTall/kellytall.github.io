async function drawBars() {

    // Access Data


    // const dataset = await d3.csv("../data/day_one_SDA.csv", function(d) {
    //     return {
    //         district: d.district,
    //         number: +d.number
    //     }
    // })
    // .sort((a, b) => d3.descending(a.number, b.number))




    const dataset = await d3.csv("../data/day_one_SDA.csv", function(d) {
        return {
            district: d.district,
            number: +d.number
        }
        // .sort((a, b) => d3.descending(a.number, b.number))
    })

    

    const sortedData = dataset.slice().sort((a, b) => d3.descending(a.number, b.number))


    console.log(sortedData)

    const districtAccessor = d => d.district
    const numberAccessor = d => d.number



    // set dimensions

    let dimensions = {
        width: window.innerWidth * 0.5,
        height: 400,
        margin: {
            top: 15,
            right: 20,
            bottom: 20,
            left: 120,
        }
    }

    dimensions.boundedWidth = dimensions.width -
        dimensions.margin.left -
        dimensions.margin.right


    dimensions.boundedHeight = dimensions.height -
        dimensions.margin.top -
        dimensions.margin.bottom


    //select the SVG and set size

    const wrapper = d3.select(".bar_chart")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)


    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${
            dimensions.margin.top
        }px)`)



    //calculate axis

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.number)])
        .range([0, dimensions.boundedWidth])

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)




    const yScale = d3.scaleBand()
        .domain(d3.range(sortedData.length))
        .rangeRound([dimensions.margin.top, dimensions.boundedHeight - dimensions.margin.bottom])
        .padding(0.1)


    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .tickFormat(i => sortedData[i].district)
        .tickSizeOuter(0)


    const format = xScale.tickFormat(20, sortedData.format)
    //draw bars

    const bars = bounds
        // .append("rect")      
        .selectAll("rect")
        .data(sortedData)
        .join("rect")
        .attr("x", xScale(0))
        .attr("y", (d, i) => yScale(i))
        .attr("width", d => xScale(d.number) - xScale(0))
        .attr("height", yScale.bandwidth())
        .attr("class", "rect")

    const text = bounds
        .selectAll("text")
        .data(sortedData)
        .join("text")
        .attr("x", d => xScale(d.number))
        .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -30)
        .attr("class", "bar_label")
        .text(d => format(d.number))

    //draw axis

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${
                dimensions.boundedHeight - dimensions.margin.top
            }px)`)



}

drawBars()