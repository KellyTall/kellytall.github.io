async function drawstatus() { 

    //import data

    const data_all = await d3.csv("./../data/number_residents.csv", function(d) {

        return {
            num_residents: d.num_residents,
            greater_sydney: +d.greater_sydney,
            sa4: d.sa4,
            prop: +d.prop

        }


    })

    const data = data_all.filter(d => d.sa4 == "Parramatta")

    // console.log(data)




    //     // group data for small multiple split, creating group based on design type and assigning key and value

    const grouped_data = Array.from(d3.group(data, d => d.sa4), ([key, value]) => ({ key, value }))




    const names = Array.from(new Set(data.map(d => d.num_residents)))

    //     // console.log(ancestry_names)

const width = 380
    const height = 250
    const margin = { top: 20, right: 30, bottom: 30, left: 150 }

    const svg = d3.select(".parramatta_res")
        .append("svg")
        .data(data)
        .attr("width", width)
        .attr("height", height)
        .attr('transform', `translate(0,${margin.top})`)

// // // // //calcualting axis

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.prop)])
        .range([margin.left, width - margin.right])

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(0)
        .tickSize(0)
        .tickFormat(d3.format('d'))
        .tickPadding(7)

    svg
        .append('g')
        .call(xAxis)
        .attr('class', 'xAxis')
        .attr('transform', `translate(0,${height-margin.bottom})`)
        .style('stroke', 'none')

const yScale = d3.scaleBand()
        .domain(d3.range(names.length))
        .range([margin.top, height - margin.bottom])
        .padding(0.2)


    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(i => data[i].num_residents)
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
        .attr("x", (d, i) => xScale(0))
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


//     // svg
//     //     .append("path")
//     //     .style("stroke", "blue")
//     //     .style("stroke-width", 2)
//     //     .attr("d", function(d){
//     //     var rv = "M" + yScale(d.ancestry) + "," + xScale(d.greater_sydney); // move to
//     //     rv += "L" + (yScale(d.ancestry) + d3.scaleBand()) + "," + xScale(d.greater_sydney); // line
//     //   return rv;
//     // });


    svg
        .append('g')
        .selectAll("text")
        .data(grouped_data)
        .join('text')
        .attr("dy", 10)
        .attr("dx", 0)
        .text(d => d.key)
        .attr("class", "small_mult_head_larger")




}

drawstatus()