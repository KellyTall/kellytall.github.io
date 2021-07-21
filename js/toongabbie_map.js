async function drawMap_topo() {


    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)




    const SA4_map = await d3.json("./../geo/SA4_simple.json")

    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)



    const SA3_map = await d3.json("./../geo/SA3_simple_copy.json")

    SA3_map.objects.SA3.geometries = SA3_map.objects.SA3.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA3_topo = topojson.feature(SA3_map, SA3_map.objects.SA3)




    const wrapper = d3.select(".location_map")
        .append("svg")
        .attr("width", "580")
        .attr("height", "500")



    let dimensions = {
        width: 580,
        margin: {
            top: 2,
            right: 20,
            bottom: 2,
            left: 20,
        },
    }


    // wrap text function

    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0, //parseFloat(text.attr("dy")),
                tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
            }
        });
    }


    // constitution hill label

    const SA2_map_toongabbie_labels_c_hill = await d3.json("./../geo/SA2_simple_copy.json")



    SA2_map_toongabbie_labels_c_hill.objects.SA2.geometries = SA2_map_toongabbie_labels_c_hill.objects.SA2.geometries.filter(d => d.properties.SA2_NAME16 == "Toongabbie - Constitution Hill")

    SA2_topo_c_hill_label = topojson.feature(SA2_map_toongabbie_labels_c_hill, SA2_map_toongabbie_labels_c_hill.objects.SA2)




    // seven hills label

    const SA2_map_toongabbie_labels_seven_hill = await d3.json("./../geo/SA2_simple_copy.json")



    SA2_map_toongabbie_labels_seven_hill.objects.SA2.geometries = SA2_map_toongabbie_labels_seven_hill.objects.SA2.geometries.filter(d => d.properties.SA2_NAME16 == "Seven Hills - Toongabbie")

    SA2_topo_sevenhills_labels = topojson.feature(SA2_map_toongabbie_labels_seven_hill, SA2_map_toongabbie_labels_seven_hill.objects.SA2)



    // console.log(SA2_topo_toongabbie_labels)

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


    // const SA4_colour = ({

    //     "Blacktown": '#A3C8FF',
    //     "Parramatta": '#A3C8FF',

    // })

    const SA2_colour = ({

        "Toongabbie - Constitution Hill": '#688B90',
        "Seven Hills - Toongabbie": '#688B90',

    })



    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)


    const SA2_background = bounds
        .selectAll(".SA2_background")
        .data(SA2_topo.features)
        .join("path")
        .attr("class", "SA2_background")
        .attr("d", pathGenerator)
        .attr("fill", (d) => SA2_colour[d.properties.SA2_NAME16] || "#B5D8DD")



    const SA3_background = bounds
        .selectAll(".SA3_background")
        .data(SA3_topo.features)
        .join("path")
        .attr("class", "SA3_background")
        .attr("d", pathGenerator)


    const SA4_background = bounds
        .selectAll(".SA4_background")
        .data(SA4_topo.features)
        .join("path")
        .attr("class", "SA4_background")
        .attr("d", pathGenerator)






    const labels = bounds
        .selectAll("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "SA4_area_label")
        .text(d => d.properties.SA4_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1])


    const SA3_labels = labels
        .select("text")
        .data(SA3_topo.features)
        .join("text")
        .attr("class", "SA3_area_label")
        .text(d => d.properties.SA3_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1]+5)
        .call(wrap, 80)


    const c_hill_labels = labels
        .select("text")
        .data(SA2_topo_c_hill_label.features)
        .join("text")
        .attr("class", "c_hill_label")
        .text(d => d.properties.SA2_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0] + 20)
        .attr("y", d => pathGenerator.centroid(d)[1]-15)
        .call(wrap, 120)





    const seven_hill_label = labels
        .select("text")
        .data(SA2_topo_sevenhills_labels.features)
        .join("text")
        .attr("class", "seven_hills_label")
        .attr("x", d => pathGenerator.centroid(d)[0] +10 )
        .attr("y", d => pathGenerator.centroid(d)[1])
        .text(d => d.properties.SA2_NAME16)
        .call(wrap, 100)



}

drawMap_topo()