async function drawMap_topo() {


    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")
    // console.log(SA2_map)

    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

    // console.log(SA2_topo)


    const SA4_map = await d3.json("./../geo/SA4_simple.json")

    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    // console.log(SA4_map)

    // console.log(SA2_map.objects.tracts)

    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)

    // console.log(SA4_topo)

    const wrapper = d3.select(".blacktown_map")
        .append("svg")
        .attr("width", "500")
        .attr("height", "500")



    let dimensions = {
        width: 500,
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
        },
    }



    dimensions.boundedWidth = (dimensions.width - dimensions.margin.left - dimensions.margin.right)


    const projection = d3.geoEquirectangular()
        .fitWidth(dimensions.boundedWidth, SA2_topo)



    const pathGenerator = d3.geoPath(projection)


    const [
        [x0, y0],
        [x1, y1]
    ] = pathGenerator.bounds(SA4_topo)


    dimensions.boundedHeight = y1
    dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom


    const SA4_colour = ({

        "Blacktown": '#DCDCDC',
        "Parramatta": '#808080',

    })

    const SA2_colour = ({

        "Toongabbie - Constitution Hill": '#FF96AD',
        "Seven Hills - Toongabbie": '#FF96AD',

    })

    
    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)


    const SA4_background = bounds
        .selectAll(".SA4_background")
        .data(SA4_topo.features)
        .join("path")
        .attr("class", "SA4_background")
        .attr("d", pathGenerator)
        .attr("fill", (d) => SA4_colour[d.properties.SA4_NAME16] || 'lightgrey')
        .attr("opacity", 0.8)


    const SA2_background = bounds
        .selectAll(".SA2_background")
        .data(SA2_topo.features)
        .join("path")
        .attr("class", "SA2_background")
        .attr("d", pathGenerator)
        .attr("fill", (d) => SA2_colour[d.properties.SA2_NAME16] || 'none')
        // .attr("opacity", 0.8)







}

drawMap_topo()