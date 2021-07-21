async function drawList() {


    const data = await d3.csv("./../data/total_SDA_SA3.csv", function(d) {
        return {
            sa3: d.sa3,
            dwellings: +d.total_dwellings_SA3
        }
    })

    const sortedData = data.slice().sort((a, b) => d3.descending(a.dwellings, b.dwellings))

    // console.log(data)

    const wrapper = d3.select(".table")
        .append("svg")
        .attr("width", "800")
        .attr("height", "200")


    let dimensions = {
        width: 800,
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
        },
    }

    dimensions.boundedWidth = (dimensions.width - dimensions.margin.left - dimensions.margin.right)


    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)



    const groups = bounds
        .selectAll("g.list")
        .data(sortedData)
        .join("g")
        // .attr("class", "sa3")
        .attr("transform", (d, i) => { return `translate(0, ${i*24})` })

     groups 
        .append("text")
        .data(sortedData)
        .join("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("class", "sa3_name")
        .text((d, i) => { return d.sa3 })

     groups 
        .append("text")
        .data(sortedData)
        .join("text")
        .attr("x", 200)
        .attr("y", 20)
        .attr("class", "dwelling_num")
        .text((d, i) => { return d.dwellings })

}

drawList()