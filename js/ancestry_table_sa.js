async function drawList() {


    const data = await d3.csv("./../data/top_ten_sa.csv", function(d) {
        return {
            SA2_NAME16: d.SA2_NAME16,
            pop_prop: +d.pop_prop,
            area_diff: +d.area_diff
        }
    })



    // const sortedData = data.slice().sort((a, b) => d3.descending(a.dwellings, b.dwellings))

    console.log(data)


    const width = 400
    const height = 400
    const margin = { top: 40, right: 10, bottom: 10, left: 50 }


    const svg = d3.select(".ancestry_table_sa")
        .append("svg")
        .attr("viewBox", "0 0 400 400")
        .attr('transform', `translate(${margin.left},${margin.top})`)


    const groups = svg
        .selectAll("g.list")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => { return `translate(0, ${i*24})` })



    groups
        .append("text")
        .data(data)
        .join("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("class", "sa2_name")
        .text((d, i) => { return d.SA2_NAME16 })

    groups
        .append("text")
        .data(data)
        .join("text")
        .attr("x", 200)
        .attr("y", 50)
        .attr("class", "table_content")
        .text((d, i) => { return d3.format(".0%")(d.pop_prop) })

    groups
        .append("text")
        .data(data)
        .join("text")
        .attr("x", 300)
        .attr("y", 50)
        .attr("class", "table_content")
        .text((d, i) => { return d3.format(".0%")(d.area_diff) })

const headers = svg
        .append("g")
 headers
        .append("text")
        .join("text")
        .attr("x", 200)
        .attr("y", 20)
        .attr("class", "table_header")
        .text("Propotion of ancestry")
    
    
    headers
        .append("text")
        .join("text")
        .attr("x", 300)
        .attr("y", 20)
        .attr("class", "table_header")
        .text("Difference from GS")
}

drawList()