async function drawMap_topo() {


    const SA4_map = await d3.json("./../geo/SA4_simple.json")



    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" &  d.properties.SA4_NAME16 !="Central Coast")

    // console.log(SA4_map)


    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)

    // console.log(SA4_topo)

    const trains_import = await d3.csv("./../data/tfnsw_train.csv", function(d) {
        return {
            location_name: d.location_name,
            latitude: +d.latitude,
            longitude: +d.longitude,
            SA4: d.SA4

        }
    })

    trains = trains_import.filter(d=>d.SA4 != "Outer")

    // console.log(trains)

    let dimensions = {
        width: window.innerWidth *.7,
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
        },
    }





    dimensions.boundedWidth = (dimensions.width - dimensions.margin.left - dimensions.margin.right)


    const projection_SA4 = d3.geoEquirectangular()
        .fitWidth(dimensions.boundedWidth, SA4_topo)



    const pathGenerator_SA4 = d3.geoPath(projection_SA4)


    const [
        [x0, y0],
        [x1, y1]
    ] = pathGenerator_SA4.bounds(SA4_topo)


    dimensions.boundedHeight = y1
    dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom



    const wrapper = d3.select(".map_overview")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)


    const background = bounds
        .selectAll(".background")
        .data(SA4_topo.features)
        .join("path")
        .attr("class", "SA4")
        .attr("d", pathGenerator_SA4)


    const labels = bounds
        .selectAll("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "area_label")
        .text(d => d.properties.SA4_NAME16)
        .attr("x", d => pathGenerator_SA4.centroid(d)[0])
        .attr("y", d => pathGenerator_SA4.centroid(d)[1])

    const points = bounds
        .selectAll("circle")    
        .data(trains)    
        .join("circle")
        .attr("class", "circle")
        .attr("cx", d => projection_SA4([d.longitude, d.latitude])[0])
        .attr("cy", d => projection_SA4([d.longitude, d.latitude])[1])
        .attr("r", 4)
    



}

drawMap_topo()