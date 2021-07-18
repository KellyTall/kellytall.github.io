async function drawMap_topo() {


    const historical_1815_map = await d3.json("./../geo/topo_1815.json")
    console.log(historical_1815_map)


    topo_1815 = topojson.feature(historical_1815_map, historical_1815_map.objects.topo1_1815)

    console.log(topo_1815)

    const wrapper = d3.select(".world_map")
        .append("svg")
        .attr("width", "800")
        .attr("height", "500")


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


    const projection = d3.geoEqualEarth()
        .fitWidth(dimensions.boundedWidth, topo_1815)

    const pathGenerator = d3.geoPath(projection)

    const [
        [x0, y0],
       [x1, y1]
    ] = pathGenerator.bounds(topo_1815)


    dimensions.boundedHeight = y1
    dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom

    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)


    const map = bounds
        .selectAll(".world_map")
        .data(topo_1815.features)
        .join("path")
        .attr("class", "world_map")
        .attr("d", pathGenerator)
        .attr("opacity", 0.8)

    const map_label = bounds
        .selectAll("text")
        .data(topo_1815.features)
        .join("text")
        .attr("class", "world_label")
        .text(d => d.properties.NAME)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1])

}


drawMap_topo()