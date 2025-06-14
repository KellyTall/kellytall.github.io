async function drawDesign_parra() {

    //import data

    const data = await d3.csv("./../data/SDA_status_design_btown.csv", function(d) {

        return {
            design: d.design,
            status: d.status,
            number: +d.sa4_status_design_total,
            sa4: d.sa4,

        }

    })




    // console.log(data)


    const grouped_data = Array.from(d3.group(data, d => d.status), ([key, value]) => ({ key, value }))

    // console.log(grouped_data)


    const design_names = Array.from(new Set(data.map(d => d.design)))


 const width = 250
    const height = 150
    const margin = { top: 25, right: 20, bottom: 20, left: 100 }

    const svg = d3.select(".toongabbie_SDA_status_design_btown")
        .selectAll("chart")
        .data(grouped_data)
        .join("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", d => d.value[0].status) // this adds design type as a class to each of the svgs :))
        .attr('transform', `translate(0,${margin.top})`)
    
 
    // //calcualting axis

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.number)])
        .range([margin.left, width - margin.left])

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
        .domain(d3.range(design_names.length))
        .range([margin.top, height - margin.bottom])
        .padding(0.2)


    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(i => data[i].design)
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
        .data(d => d.value)
        .join('rect')
        .attr("x", (d, i) => xScale(0))
        .attr("y", (d, i) => yScale(i))
        .attr("width", d => xScale(d.number) - xScale(0))
        .attr("height", yScale.bandwidth())
        .attr("class", "bar_rect")


    svg
        .append('g')
        .selectAll("text")
        .data(d => d.value)
        .join("text")
        .attr("x", d => xScale(d.number))
        .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", 5)
        .attr("class", "small_multiple_bar_label")
        .text(d => d.number)


    svg
        .append('text')
        .attr("dy", 7)
        .attr("dx", 0)
        .text(d => d.key)
        .attr("class", "small_mult_head")





}
drawDesign_parra()