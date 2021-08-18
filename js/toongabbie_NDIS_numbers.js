async function drawNDIS() {


    const data = await d3.csv("./../data/toongabbie_NDIS_participant_summary_sa3.csv", function(d) {

        return {
            sa3_name: d.SA3_NAME_2016,
            NDIS_number: +d.SA3_prtcpnt_cnt,

        }

    })

    // console.log(data)

    const width = 380
    const height = 300
    const margin = { top: 15, right: 10, bottom: 20, left: 110 }

    const svg = d3.select(".toongabbie_NDIS_number")
        .append("svg")
        .data(data)
        .attr("width", width)
        .attr("height", height)


    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.NDIS_number)])
        .range([margin.left, width - margin.right])
    


    const xAxis = d3.axisBottom()
        .scale(xScale)
        .scale(xScale)
        .ticks(4)
        .tickSize(0)
        .tickFormat(d3.format('d'))
        .tickPadding(7)

    // svg
    //     .append("g")
    //     .call(xAxis)
    //     .attr('transform', `translate(0,${height-margin.bottom})`)



    const yScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(0.1)


    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(i => data[i].sa3_name)
        .tickSizeOuter(0)
        .tickSizeInner(2)

    svg
        .append("g")
        .call(yAxis)
        .attr('transform', `translate(${margin.left},0)`)


    svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", xScale(0))
        .attr("y", (d, i) => yScale(i))
        .attr("width", d => xScale(d.NDIS_number) - xScale(0))
        .attr("height", yScale.bandwidth())
        .attr("class", "bar_rect")
        

    svg
        .append("g")
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("x", d => xScale(d.NDIS_number))
        .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -30)
        .attr("class", "bar_label")
        .text(d => d.NDIS_number)
        .attr("class", "inside_bar_label")






}

drawNDIS()