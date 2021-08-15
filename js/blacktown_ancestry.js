async function drawstatus() {

    //import data

    const data_all = await d3.csv("./../data/ancestry_1.csv", function(d) {

        return {
            ancestry: d.ancestry,
            greater_sydney: +d.greater_sydney,
            sa4: d.sa4,
            prop: +d.prop

        }


    })


    const data_unsort = data_all.filter(d => d.sa4 == "Blacktown")

    const data = data_unsort.slice().sort((a, b) => d3.descending(a.prop, b.prop))

    // console.log(data)





    //     // group data for small multiple split, creating group based on design type and assigning key and value

    const grouped_data = Array.from(d3.group(data, d => d.sa4), ([key, value]) => ({ key, value }))




    const ancestry_names = Array.from(new Set(data.map(d => d.ancestry)))

    //     // console.log(ancestry_names)

    const width = 350
    const height = 250
    const margin = { top: 20, right: 30, bottom: 30, left: 120 }

    const svg = d3.select(".blacktown_ancestry")
        .append("svg")
        .data(data)
        .attr("width", width)
        .attr("height", height)
        // .attr("class", d => d.value[0].sa4) // this adds design type as a class to each of the svgs :))
        .attr('transform', `translate(0,${margin.top})`)

    // // // //calcualting axis

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.greater_sydney)])
        .range([margin.left, width - margin.right])
        .nice()

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickPadding(5)
        .tickFormat(d3.format(",.0%"))
        .ticks(3)

    svg
        .append('g')
        .call(xAxis)
        .attr('class', 'xAxis')
        .attr('transform', `translate(0,${height-margin.bottom})`)
        .style('stroke', 'none')

    const yScale = d3.scaleBand()
        .domain(d3.range(ancestry_names.length))
        .range([margin.top, height - margin.bottom])
        .padding(0.2)


    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(i => data[i].ancestry)
        .tickSizeOuter(0)
        .tickSizeInner(2)



    svg
        .append('g')
        .call(yAxis)
        .attr('class', 'yAxis')
        .attr('transform', `translate(${margin.left},0)`)


    svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr("fill", "teal")
        .attr("x", xScale(0))
        .attr("y", (d, i) => yScale(i))
        .attr("width", d => xScale(d.prop) - xScale(0))
        .attr("height", yScale.bandwidth())
        .attr('class', 'rect')


    svg
        .append('g')
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("x", d => xScale(d.prop))
        .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", 5)
        .attr("class", "small_multiple_bar_label")
        .text(d => d3.format(".0%")(d.prop))


    svg
        .append('g')
        .selectAll("text")
        .data(grouped_data)
        .join('text')
        .attr("dy", 10)
        .attr("dx", 0)
        .text(d => d.key)
        .attr("class", "small_mult_head_larger")

    var size = 2

    svg
        .append('g')
        .selectAll('line')
        .data(data)
        .join("line")
        .attr("y1", (d, i) => yScale(i) + yScale.bandwidth() + size)
        .attr("y2", (d, i) => yScale(i) - size)

        .attr("x1", (d, i) => xScale(d.greater_sydney))
        .attr("x2", (d, i) => xScale(d.greater_sydney))
        .attr("class", "average_line")



}

drawstatus()