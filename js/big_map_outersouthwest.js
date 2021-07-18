async function drawMap_topo() {


    const SA2_map_outersouthwest = await d3.json("./../geo/SA2_simple.json")



    SA2_map_outersouthwest.objects.SA2.geometries = SA2_map_outersouthwest.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Sydney - Outer South West")

    // console.log(SA2_map)


    SA2_topo_outersouthwest = topojson.feature(SA2_map_outersouthwest, SA2_map_outersouthwest.objects.SA2)

    // console.log(SA2_topo)

    const trains_import = await d3.csv("./../data/tfnsw_train.csv", function(d) {
        return {
            location_name: d.location_name,
            latitude: +d.latitude,
            longitude: +d.longitude,
            SA4: d.SA4

        }
    })

    trains = trains_import.filter(d=>d.SA4 != "Outer" & d.SA4=="Sydney - Outer South West")



    // console.log(trains)

    const wrapper = d3.select(".map_outersouthwest")
        .append("svg")
        .attr("viewBox", "0 0 1200 1000")
        

    let dimensions = {
        width: 1200,
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
        },
    }




    dimensions.boundedWidth = (dimensions.width - dimensions.margin.left - dimensions.margin.right)


    const projection_SA2 = d3.geoEquirectangular()
        .fitWidth(dimensions.boundedWidth, SA2_topo_outersouthwest)



    const pathGenerator_SA2 = d3.geoPath(projection_SA2)


    const [
        [x0, y0],
        [x1, y1]
    ] = pathGenerator_SA2.bounds(SA2_topo_outersouthwest)


    dimensions.boundedHeight = y1
    dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom



    
    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)


    const background = bounds
        .selectAll(".background")
        .data(SA2_topo_outersouthwest.features)
        .join("path")
        .attr("class", "SA2")
        .attr("d", pathGenerator_SA2)


    const labels = bounds
        .selectAll("text")
        .data(SA2_topo_outersouthwest.features)
        .join("text")
        .attr("class", "area_label")
        .text(d => d.properties.SA2_NAME16)
        .attr("x", d => pathGenerator_SA2.centroid(d)[0])
        .attr("y", d => pathGenerator_SA2.centroid(d)[1])

    const points = bounds
        .selectAll("circle")    
        .data(trains)    
        .join("circle")
        .attr("class", "circle")
        .attr("cx", d => projection_SA2([d.longitude, d.latitude])[0])
        .attr("cy", d => projection_SA2([d.longitude, d.latitude])[1])
        .attr("r", 4)

        const point_label = points
        .select("text")    
        .data(trains)    
        .join("text")
        .attr("class", "point_label")
        .text(d => d.location_name)
        .attr("x", d => projection_SA2([d.longitude, d.latitude +.002])[0])
        .attr("y", d => projection_SA2([d.longitude, d.latitude + .002])[1])
        
    



}

drawMap_topo()