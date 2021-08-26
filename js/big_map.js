async function drawMap_topo() {


    const SA4_map = await d3.json("./../geo/SA4_simple.json")



    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")

    console.log(SA4_map)


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

    trains = trains_import.filter(d => d.SA4 != "Outer")

    // console.log(trains)


    const width = 1000
    const height = 1000
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    // const wrapper = d3.select(".map_overview")
    //     .append("svg")
    //     .attr("viewBox", "0 0 1200 1000")


    const svg_big_map = d3.select(".map_overview")
        .append("svg")
        .attr("viewBox", "0 0 1000 1000")
        .attr('transform', `translate(0,${margin.top})`)



    const projection_SA4 = d3.geoEquirectangular()
        .fitWidth(width, SA4_topo)



    const pathGenerator_SA4 = d3.geoPath(projection_SA4)



    const background = svg_big_map
        .append('g')
        .selectAll(".background")
        .data(SA4_topo.features)
        .join("path")
        .attr("class", "SA4_big_map")
        .attr("d", pathGenerator_SA4)


    const labels = svg_big_map
        .append('g')
        .selectAll("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "area_label")
        .text(d => d.properties.SA4_NAME16)
        .attr("x", d => pathGenerator_SA4.centroid(d)[0])
        .attr("y", d => pathGenerator_SA4.centroid(d)[1])

    const points = svg_big_map
        .append('g')
        .selectAll("circle")
        .data(trains)
        .join("circle")
        .attr("class", "circle")
        .attr("cx", d => projection_SA4([d.longitude, d.latitude])[0])
        .attr("cy", d => projection_SA4([d.longitude, d.latitude])[1])
        .attr("r", 4)




}

drawMap_topo()