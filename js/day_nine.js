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


    const trains_import = await d3.csv("./../data/tfnsw_train.csv", function(d) {
        return {
            location_name: d.location_name,
            latitude: +d.latitude,
            longitude: +d.longitude,
            SA4: d.SA4

        }
    })

    trains = trains_import.filter(d => d.SA4 != "Outer" & (d.SA4 == "Sydney - Parramatta" || d.SA4 =="Sydney - Blacktown"))

    console.log(trains)

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


    const legendGroup = wrapper
        .append("g")
        .attr("transform", `translate(${
         400
       },${
         dimensions.width <500
         ? dimensions.boundedHeight -10
         : dimensions.boundedHeight - 10    
       })`)
        // .attr("x", 600)
        // .attr("y", 200)
        .attr("class", "legendGroup")

    const legendTitle = legendGroup
        .append("text")
        .attr("y", -305)
        // .attr("x", 10)
        .attr("class", "legendHeader")
        .text("SA4 Displayed")

    const legendSize = 10

    // const legendHeight = 16

    const legendBox1 = legendGroup
        .append("rect")
        .attr("y", -290)
        .attr("height", legendSize)
        .attr("width", legendSize)
        .style("fill", `#DCDCDC`)


    const legendBox2 = legendGroup
        .append("rect")
        // .attr("x", legendSize / 2)
        .attr("y", -270)
        .attr("height", legendSize)
        .attr("width", legendSize)
        .style("fill", `#808080`)

    const legendText1 = legendGroup
        .append("text")
        .attr("y", -280)
        .attr("x", 20)
        .attr("class", "legendTitle")
        .text("Blacktown")

    const legendText2 = legendGroup
        .append("text")
        .attr("y", -260)
        .attr("x", 20)
        .attr("class", "legendTitle")
        .text("Parramatta")


    const labels = bounds
        .selectAll("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "SA4_area_label")
        .text(d => d.properties.SA4_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1])



    const points = bounds
        .selectAll("circle")
        .data(trains)
        .join("circle")
        .attr("class", "circle")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", 4)

}


drawMap_topo()