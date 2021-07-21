async function drawDesign() {

    //import data

    const data = await d3.csv("./../data/toongabbie_SDA_design_SA3_SA4.csv", function(d) {

        return {
            design: d.design,
            number: +d.number,
            sa3: d.sa3,
            sa4: d.sa4,
            total_dwellings_SA3: +d.total_dwellings_SA3,
            total_dwellings_SA4: +d.total_dwellings_SA4
        }


    })



    console.log(data)

    // group data for small multiple split, creating group based on design type and assigning key and value

    const grouped_data = Array.from(d3.group(data, d => d.design), ([key, value]) => ({ key, value }))

    console.log(grouped_data)


    const sa3_names = Array.from(new Set(data.map(d => d.sa3)))


    console.log(sa3_names)

    // set width and heght

    const width = 100
    const height = 200
    const margin = { top: 30, right: 0, bottom: 10, left: 30 }

    const svg = d3.select(".sda_sa3_design")
        .selectAll("small_chart")
        .data(grouped_data)
        .join("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", d => d.value[0].design) // this adds design type as a class to each of the svgs :))

    //calcualting axis

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.number)])
        .range([margin.left, width - margin.right])

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(4)
        .tickSize(1)
        .tickFormat(d3.format('d'))
        .tickPadding(7)

    svg
        .append('g')
        .call(xAxis)
        .attr('class', 'xAxis')
        .attr('transform', `translate(0,${height})`)




    const yScale = d3.scaleBand()
        .domain(sa3_names)
        .rangeRound([margin.top, height - margin.bottom])
        .padding(0.1)


    const yAxis = d3.axisLeft()
        .scale(yScale)


    svg
        .append('g')
        .call(yAxis)
        .attr('class', 'yAxis')



    svg
        .append('g')
        .selectAll('rect')
        .data(d => d.value)
        .join('rect')
        .attr("fill", "#ddd")
        .attr('y', function(c) { return yScale(c.sa3) })
        .attr('height', yScale.bandwidth())
        .attr('x', function(c) { return xScale(c.number); })
        .attr('height', function(c) { return width - xScale(c.number); })
        .attr('class', 'bar')
    // .attr('fill', 'teal')



}

drawDesign()