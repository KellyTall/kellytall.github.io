async function drawMap_topo() {


    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

    // console.log(SA2_topo)



    const data = await d3.csv("./../data/south_asian_ancestry.csv", function(d) {
        return {
            SA2_NAME16: d.SA2_NAME16,
            prop: +d.pop_prop,
            area_diff: +d.area_diff
        }
    })


    const SA2_name_accessor = d => d.properties["SA2_NAME16"]

    

    

    const data_mapped = new Map(data.map(d => [d.SA2_NAME16, d.area_diff]))



    console.log(data_mapped)

    const value_accessor = data_mapped.values()
    
    console.log(value_accessor)

    const max_prop = d3.max(data, d => d.area_diff)
    const min_prop = d3.min(data, d => d.area_diff)



    const scale_color = d3.scaleLinear()
        .domain([min_prop, 0, max_prop])
        .range(["#90DDB4", "white", "#ED4611"])



    const width = 700
    const height = 700
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".tooltip_map")
        .append("svg")
        .attr("viewBox", "0 0 700 700")
        .attr('transform', `translate(0,${margin.top})`)


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
        .attr("transform", "translate(0,10)")

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




SA2.on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  function onMouseEnter(i, d) {
    tooltip.style("opacity", 1)


    tooltip.select("#sa2")
        .text(SA2_name_accessor(d))

    tooltip.select("#value")
        .text(`${d3.format(".0%")(data_mapped.get(d.properties.SA2_NAME16) || 0)}`)

    const x = pathGenerator_SA2.centroid(d)[0]-50
    const y = pathGenerator_SA2.centroid(d)[1]+400


    tooltip.style("transform", `translate(`
      + `calc( ${x}px),`
      + `calc(${y}px)`
      + `)`)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }



}

drawMap_topo()