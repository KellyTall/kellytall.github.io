async function drawMap_topo() {


    const SA3_SDA_data = await d3.csv("./../data/total_SDA_SA3.csv", function(d) {
        return {
            SA3_NAME16: d.sa3,
            total_dwellings_SA3: +d.total_dwellings_SA3
        }
    })

    // mapping data to create the chlropleth map later

    const data_mapped = new Map(SA3_SDA_data.map(d => [d.SA3_NAME16, d.total_dwellings_SA3]))

    console.log(data_mapped)

    // max and min of number of dwllings in SA3

    const max_dwelling = d3.max(SA3_SDA_data, d => d.total_dwellings_SA3)
    const min_dwelling = d3.min(SA3_SDA_data, d => d.total_dwellings_SA3)

    


    // importing mapping data and converting topoJson to Geojson

    const SA3_map = await d3.json("./../geo/SA3_simple_copy.json")

    SA3_map.objects.SA3.geometries = SA3_map.objects.SA3.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA3_topo = topojson.feature(SA3_map, SA3_map.objects.SA3)



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)




    const SA4_map = await d3.json("./../geo/SA4_simple.json")

    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)





// constitution hill label

    const SA2_map_toongabbie_labels_c_hill = await d3.json("./../geo/SA2_simple_copy.json")



    SA2_map_toongabbie_labels_c_hill.objects.SA2.geometries = SA2_map_toongabbie_labels_c_hill.objects.SA2.geometries.filter(d => d.properties.SA2_NAME16 == "Toongabbie - Constitution Hill")

    SA2_topo_c_hill_label = topojson.feature(SA2_map_toongabbie_labels_c_hill, SA2_map_toongabbie_labels_c_hill.objects.SA2)




    // seven hills label

    const SA2_map_toongabbie_labels_seven_hill = await d3.json("./../geo/SA2_simple_copy.json")



    SA2_map_toongabbie_labels_seven_hill.objects.SA2.geometries = SA2_map_toongabbie_labels_seven_hill.objects.SA2.geometries.filter(d => d.properties.SA2_NAME16 == "Seven Hills - Toongabbie")

    SA2_topo_sevenhills_labels = topojson.feature(SA2_map_toongabbie_labels_seven_hill, SA2_map_toongabbie_labels_seven_hill.objects.SA2)



    
    const wrapper = d3.select(".sda_sa3_map")
        .append("svg")
        .attr("width", "273")
        .attr("height", "249")



    let dimensions = {
        width: 273,
        margin: {
            top: 2,
            right: 2,
            bottom: 2,
            left: 2,
        },
    }


    // // wrap text function

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



    dimensions.boundedWidth = (dimensions.width - dimensions.margin.left - dimensions.margin.right)


    const projection = d3.geoEquirectangular()
        .fitWidth(dimensions.boundedWidth, SA3_topo)



    const pathGenerator = d3.geoPath(projection)


    const [
        [x0, y0],
        [x1, y1]
    ] = pathGenerator.bounds(SA3_topo)


    dimensions.boundedHeight = y1
    dimensions.height = dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom


    const SA2_colour = ({

        "Toongabbie - Constitution Hill": '#86BF84',
        "Seven Hills - Toongabbie": '#86BF84',

    })

    const scale_color = d3.scaleQuantize([min_dwelling, max_dwelling], d3.schemeOranges[9])



    const bounds = wrapper
        .append("g")
        .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)


    


    const SA3_background = bounds
        .selectAll(".SA3_background")
        .data(SA3_topo.features)
        .join("path")
        .attr("class", "SA3_dwelling_map")
        .attr("d", pathGenerator)
        .attr("fill", d => scale_color(data_mapped.get(d.properties.SA3_NAME16)))


    
        const SA2_background = bounds
        .selectAll(".SA2_background")
        .data(SA2_topo.features)
        .join("path")
        .attr("class", "SA2_background")
        .attr("d", pathGenerator)
        .attr("fill", d => SA2_colour[d.properties.SA2_NAME16] || 'none')
        .attr("opacity", "0.4")



    const SA3_labels = bounds
        .selectAll("text")
        .data(SA3_topo.features)
        .join("text")
        .attr("class", "SA3_area_label_small")
        .text(d => d.properties.SA3_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1] + 5)
        .call(wrap, 40)




        const SA4_labels = SA3_labels
        .select("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "SA4_area_label_small")
        .text(d => d.properties.SA4_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1])

        




}

drawMap_topo()