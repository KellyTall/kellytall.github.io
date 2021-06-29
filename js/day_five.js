async function drawMap_topo() {


    const SA2_map = await d3.json("./../geo/SA2_simple.json")

 

    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Sydney - Blacktown")


        console.log(SA2_map)

    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

	console.log(SA2_topo)    



 

    let dimensions = {
        width: window.innerWidth * .5,
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
        },
    }



    dimensions.boundedWidth = (dimensions.width - dimensions.margin.left - dimensions.margin.right)


    const projection_SA4 = d3.geoEquirectangular()
        .fitWidth(dimensions.boundedWidth, SA2_topo)



    const pathGenerator_SA4 = d3.geoPath(projection_SA4)


    const [
        [x0, y0],
        [x1, y1]
    ] = pathGenerator_SA4.bounds(SA2_topo)


    dimensions.boundedHeight = y1
    dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom



    const wrapper = d3.select(".blacktown_map")
    	.append("svg")
    	.attr("width", dimensions.width )
        .attr("height", dimensions.height)

    const bounds = wrapper
    	.append("g")    
    	// .attr("class", "wrapper_give_assistance")
        .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

    const background = bounds
        .selectAll(".background")
        .data(SA2_topo.features)
        .join("path")
        .attr("class", "background")
        .attr("d", pathGenerator_SA4)





}

drawMap_topo()