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
    const margin = { top: 100, right: 50, bottom: 20, left: 50 }


    const svg = d3.select(".chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])



    // // // // //calcualting axis\


    const yScale = d3.scaleBand()
        .domain(d3.range(language_names.length))
        .range([margin.top, height - margin.bottom])
        .padding(0.1)


    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(i => data[i].language)
        .tickSizeOuter(0)
        .tickSizeInner(2)

    svg
        .append('g')
        .call(yAxis)
        .attr('class', 'yAxis')
        .attr('transform', `translate(${margin.left},0)`)


    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.greater_sydney)])
        .range([margin.left, width - margin.right])
        

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickPadding(5)
        .tickFormat(d3.format(",.0%"))
        .ticks(5)

    svg
        .append('g')
        .call(xAxis)
        .attr('class', 'xAxis')
        .attr('transform', `translate(0,${height-margin.bottom})`)
        .style('stroke', 'none')



    svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')

        .attr("x", (d, i) => xScale(0))
        .attr("y", (d, i) => yScale(i))
        .attr("width", d => xScale(d.prop) - xScale(0))
        .attr("height", yScale.bandwidth())
        .attr('class', 'rect')


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

drawSmall()