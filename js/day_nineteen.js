async function drawMap_locations() {


    const SA3_map = await d3.json("./../geo/SA3_simple_copy.json")


    SA3_map.objects.SA3.geometries = SA3_map.objects.SA3.geometries.filter(d => d.properties.SA4_NAME16 == "City and Inner South" || d.properties.SA4_NAME16 == "Eastern Suburbs")


    SA3_topo = topojson.feature(SA3_map, SA3_map.objects.SA3)

    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "City and Inner South" || d.properties.SA4_NAME16 == "Eastern Suburbs")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

    



  
    const tree = await d3.csv("./../data/jacaranda_sydney.csv", function(d) {
        return {
            lon: +d.X,
            lat: +d.Y,
            tree_type: d.TreeType,
            height: +d.TreeHeight, 
            canopy_EW: +d.TreeCanopyEW,
            canopy_EW: +d.TreeCanopyNS


        }
    })

    console.log(tree)


    // const address_accessor = d => d.geoAddress

    



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

    
    const width = 700
    const height = 700
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".city_map")
        .append("svg")
        .attr("viewBox", "0 0 700 700")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_SA3 = d3.geoEquirectangular()
        .fitWidth(width, SA3_topo)



    const pathGenerator_SA3 = d3.geoPath(projection_SA3)

    const radius = d3.scaleSqrt([d3.min(tree, d => d.height), d3.max(tree, d => d.height)], [1, 15])

    const SA3 = svg
        .append("g")
        .selectAll("path")
        .data(SA3_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA3)
        .attr("class", "SA3_map_no_hover")

        

    
    const SA2 = svg
        .append("g")
        .selectAll("path")
        .data(SA2_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA3)
        .attr("class", "SA2_map_no_fill")



SA2
        .select("text")
        .data(SA2_topo.features)
        .join("text")
        .attr("class", "SA2_label_tree")
        .text(d => d.properties.SA2_NAME16)
        .attr("x", d => pathGenerator_SA3.centroid(d)[0])
        .attr("y", d => pathGenerator_SA3.centroid(d)[1])
        .call(wrap, 70)

SA3
        .select("text")
        .data(SA3_topo.features)
        .join("text")
        .attr("class", "SA3_label_tree")
        .text(d => d.properties.SA3_NAME16)
        .attr("x", d => pathGenerator_SA3.centroid(d)[0])
        .attr("y", d => pathGenerator_SA3.centroid(d)[1])
        .call(wrap, 80)
    

    const tree_point = svg
        .selectAll("circle")    
        .data(tree)    
        .join("circle")
        .attr("class", "tree_point")
        .attr("cx", d => projection_SA3([d.lon, d.lat])[0])
        .attr("cy", d => projection_SA3([d.lon, d.lat])[1])
        .attr("r", d => radius(d.height))



    const legend = svg
        .append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(20,20)")

    const legendSize = d3.legendSize()
        
  .scale(radius)
  .shape('circle')
        
        .title("Height of Jacaranda Trees (m)")
        // .labelFormat(d3.format(".0%"))


    svg
        .select(".legendSize")
        .call(legendSize)


    // // property.on("mouseenter", onMouseEnter)
    // //     .on("mouseleave", onMouseLeave)

    // // const tooltip = d3.select("#tooltip_property")

    // // function onMouseEnter(i, d) {
    // //     tooltip
    // //     .style("opacity", .9)


    // //     tooltip
    // //     .select("#property_address")
    // //         .text(address_accessor(d))

    // //     // tooltip
    // //     // .select("#value_viet")
    // //     //     .text(`${d3.format(".0%")(data_mapped.get(d.properties.SA2_NAME16) || "NA")}`)

    // //     const x = projection_SA2([d.lon, d.lat])[0]
    // //     const y = projection_SA2([d.lon, d.lat])[1]


    // //     tooltip
    // //     .style("transform", `translate(` +
    // //         `calc( ${x}px),` +
    // //         `calc(${y}px)` +
    // //         `)`)
    // // }

    // // function onMouseLeave() {
    // //     tooltip
    // //             .style("opacity", 0)
    // // }



}

drawMap_locations()