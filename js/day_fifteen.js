async function drawSmall() {


    const data_all = await d3.csv("./../data/day_15.csv", function(d) {

        return {
            language: d.english_language_proficiency2,
            greater_sydney: +d.greater_sydney,
            sa4: d.sa4,
            prop: +d.prop

        }


    })


    console.log(data_all)

    const data = data_all.filter(d => d.sa4 == "Blacktown")

    console.log(data)

    const language_names = Array.from(new Set(data.map(d => d.language)))

    const width = 700
    const height = 500
    const margin = { top: 100, right: 50, bottom: 20, left: 40 }


    const svg = d3.select(".chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])



    // // // // //calcualting axis\


    const xScale = d3.scaleBand()
        .domain(d3.range(language_names.length))
        .range([margin.left, width - margin.right])
        .padding(0.2)


    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(i => data[i].language)
        .tickSizeOuter(0)
        .tickSizeInner(2)



    svg
        .append('g')
        .call(xAxis)
        .attr('class', 'xAxis')
        .attr('transform', `translate(0,${height-margin.bottom})`)


    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.greater_sydney)])
        .range([height - margin.bottom, margin.top])
        .nice()

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickPadding(5)
        .tickFormat(d3.format(",.0%"))
        .ticks(5)
    // .tickSize(width - margin.left - margin.right)


    svg
        .append('g')
        .call(yAxis)
        .attr('class', 'yAxis')
        .attr('transform', `translate(${margin.left},0)`)
        .style('stroke', 'none')



    svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')

        .attr("x", (d, i) => xScale(i))

        .attr("y", (d, i) => yScale(d.prop))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.prop))

        .attr('class', 'rect')
        .attr("fill", "teal")

 var size = 5

    svg
        .append('g')
        .selectAll('line')
        .data(data)
        .join("line")
        .attr("x1", (d, i) => xScale(i) + xScale.bandwidth() + size)
        .attr("x2", (d, i) => xScale(i) - size)

        .attr("y1", (d, i) => yScale(d.greater_sydney))
        .attr("y2", (d, i) => yScale(d.greater_sydney))
        .attr("class", "average_line")






}

drawSmall()