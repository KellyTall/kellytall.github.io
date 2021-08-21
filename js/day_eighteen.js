async function drawMap_topo() {


    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

    console.log(SA2_topo)

    const SA2_name_accessor = d => d.properties["SA2_NAME16"]

    const data = await d3.csv("./../data/south_asian_ancestry.csv", function(d) {
        return {
            SA2_NAME16: d.SA2_NAME16,
            prop: +d.pop_prop,
            area_diff: +d.area_diff
        }
    })


    const data_mapped = new Map(data.map(d => [d.SA2_NAME16, d.area_diff]))

    console.log(data)

    const max_prop = d3.max(data, d => d.area_diff)
    const min_prop = d3.min(data, d => d.area_diff)



    const scale_color = d3.scaleLinear()
        .domain([min_prop, 0, max_prop])
        .range(["#90DDB4", "white", "#B35334"])



    const width = 700
    const height = 700
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".tooltip_map")
        .append("svg")
        .attr("viewBox", "0 0 700 700")


    const projection_SA2 = d3.geoEquirectangular()
        .fitWidth(width, SA2_topo)



    const pathGenerator_SA2 = d3.geoPath(projection_SA2)

    const SA2 = svg
        .append("g")
        .selectAll(".map")
        .data(SA2_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA2)
        .attr("fill", d => scale_color(data_mapped.get(d.properties.SA2_NAME16)) || "darkgrey")
        .attr("class", "SA2_map")

    const legend = svg
        .append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(0,40)")

    const legendLinear = d3.legendColor()
        .shapeWidth(10)
        .shapeHeight(10)
        .shapePadding(5)
        .cells(10)
        .orient('vertical')
        .scale(scale_color)
        .title("Difference from Greater Sydney average")
        .labelFormat(d3.format(".0%"))


    svg
        .select(".legendLinear")
        .call(legendLinear)

    // const text = SA2
    //         .select("text")
    //         .data(SA2_topo.features)
    //         .join("text")
    //         .attr("class", "SA2_area_label_small")
    //         .text(d => d.properties.SA2_NAME16)
    //         .attr("x", d => pathGenerator_SA2.centroid(d)[0])
    //         .attr("y", d => pathGenerator_SA2.centroid(d)[1])


// const metricValue = data_mapped[key(datum)]
// console.log(metricValue)

   SA2.on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)

  // const tooltip = d3.select("#tooltip")
  function onMouseEnter(e, datum) {
    tooltip.style("opacity", 1)

   } 

  //   tooltip.select("#country")
  //       .text(d => data_mapped.get(d.properties.SA2_NAME16))

    // tooltip.select("#value")
    //     .text(`${d3.format(",.2f")(metricValue || 0)}%`)

  //   const [centerX, centerY] = pathGenerator_SA2.centroid(datum)

  //   const x = centerX + dimensions.margin.left
  //   const y = centerY + dimensions.margin.top

  //   tooltip.style("transform", `translate(`
  //     + `calc( -50% + ${x}px),`
  //     + `calc(-100% + ${y}px)`
  //     + `)`)

  

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }



}

drawMap_topo()