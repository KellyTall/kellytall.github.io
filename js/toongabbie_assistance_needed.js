async function drawUnpaid_Assistance() {


    const data = await d3.csv("./../data/toongabbie_assistance_needed.csv", function(d) {
        return {
            SA2_NAME16: d.SA2_NAME_2016,
            prop: +d.prop_sa2
        }
    })

    const data_mapped = new Map(data.map(d => [d.SA2_NAME16, d.prop]))


    const max_assistance = d3.max(data, d => d.prop)
    const min_assistance = d3.min(data, d => d.prop)

    // const scale_color = d3.scaleQuantize([min_assistance, max_assistance], d3.schemeBlues[9])
const scale_color = d3.scaleLinear()

    .domain([min_assistance, max_assistance])
    .range([ "#B5D8DD", "#406770"])
    


    // importing mapping data and converting topoJson to Geojson

    const SA3_map = await d3.json("./../geo/SA3_simple_copy.json")

    SA3_map.objects.SA3.geometries = SA3_map.objects.SA3.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA3_topo = topojson.feature(SA3_map, SA3_map.objects.SA3)



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)


    // console.log(SA2_topo)



    const SA4_map = await d3.json("./../geo/SA4_simple.json")

    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)

    const SA2_map_toongabbie = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map_toongabbie.objects.SA2.geometries = SA2_map_toongabbie.objects.SA2.geometries.filter(d => d.properties.SA2_NAME16 == "Seven Hills - Toongabbie" || d.properties.SA2_NAME16 == "Toongabbie - Constitution Hill")

    SA2_topo_toongabbie = topojson.feature(SA2_map_toongabbie, SA2_map_toongabbie.objects.SA2)

console.log(SA2_topo_toongabbie)


    const width = 300
    const height = 300
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }

    const svg = d3.select(".toongabbie_require_assistance")
        .append("svg")
        .attr("width", width)
    .attr("height", height)


    const projection = d3.geoEquirectangular()
        .fitWidth(height, SA3_topo)



    const pathGenerator = d3.geoPath(projection)


    // const [
    //     [x0, y0],
    //     [x1, y1]
    // ] = pathGenerator.bounds(SA3_topo)


    // height = y1




    const map = svg
        .append("g")
      



    map
        .selectAll(".SA2_background")
        .data(SA2_topo.features)
        .join("path")
        .attr("class", "SA2_background")
        .attr("d", pathGenerator)
        .attr("fill", d => scale_color(data_mapped.get(d.properties.SA2_NAME16)) || "#E5E5E5")

      

  map
        .selectAll(".SA2_background_toongabbie")
        .data(SA2_topo_toongabbie.features)
        .join("path")
        .attr("class", "SA2_background_toongabbie")
        .attr("d", pathGenerator)
        .attr("fill", d => scale_color(data_mapped.get(d.properties.SA2_NAME16)))
        
    




map
        .selectAll("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "SA4_choropleth_small_label")
        .text(d => d.properties.SA4_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1])
        // .call(wrap, 50)

        const legend = svg
    .append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(20,200)");

var legendLinear = d3.legendColor()
  .shapeWidth(10)
  .shapeHeight(10)
  .shapePadding(5)
  .cells(5)
  .orient('vertical')
  .scale(scale_color)
  .title("Require assistance %")
  .labelFormat(d3.format(".0%"))

svg.select(".legendLinear")
  .call(legendLinear);


}

drawUnpaid_Assistance()