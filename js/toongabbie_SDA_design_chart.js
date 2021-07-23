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



    // console.log(data)

    // group data for small multiple split, creating group based on design type and assigning key and value

    const grouped_data = Array.from(d3.group(data, d => d.design), ([key, value]) => ({ key, value }))

    // console.log(grouped_data)


    const sa3_names = Array.from(new Set(data.map(d => d.sa3)))


    // console.log(sa3_names)


    // // wrap text function



    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 0 // ems
            // y = text.attr("y"),
            y = -1,
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 20).attr("y", y - y * 8).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }

    // set width and height

    const width = 95
    const height = 200
    const margin = { top: 15, right: 20, bottom: 20, left: 20 }

    const svg = d3.select(".toongabbie_SDA_design_chart")
        .selectAll("small_chart")
        .data(grouped_data)
        .join("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", d => d.value[0].design) // this adds design type as a class to each of the svgs :))





    //calcualting axis

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.number)])
        .range([margin.left, width-margin.left])

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(0)
        .tickSize(0)
        .tickFormat(d3.format('d'))
        .tickPadding(7)

    // svg
    //     .append('g')
    //     .call(xAxis)
    //     .attr('class', 'xAxis_small_multiple')
    //     .attr('transform', `translate(0,${height-margin.bottom})`)
    //     .style('stroke', 'none')


    const yScale = d3.scaleBand()
        .domain(d3.range(sa3_names.length))
        .range([margin.top, height - margin.bottom])
        .padding(0.2)


    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickSizeOuter(0)



    svg
        .append('g')
        .selectAll('rect')
        .data(d => d.value)
        .join('rect')
        .attr("fill", "teal")
        .attr("x", (d, i) => xScale(0))
        .attr("y", (d, i) => yScale(i))
        .attr("width", d => xScale(d.number) - xScale(0))
        .attr("height", yScale.bandwidth())

        .attr('class', 'rect')


    svg
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
        .attr("dy", 1)
        .attr("dx", margin.left)
        .text(d => d.key)
        .attr("class", "small_mult_head")
        .call(wrap, 60)







}

drawDesign()