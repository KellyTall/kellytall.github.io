async function drawMap_locations() {



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)



    const SA3_map = await d3.json("./../geo/SA3_simple_copy.json")


    SA3_map.objects.SA3.geometries = SA3_map.objects.SA3.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney")


    SA3_topo = topojson.feature(SA3_map, SA3_map.objects.SA3)



    const SA4_map = await d3.json("./../geo/SA4_simple.json")


    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney")


    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)


    const museum = await d3.json("./../data/osm_museum.json")

    console.log(museum)


    const name_accessor = d => d.tags.name

    //     // // // //     // // wrap text function

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


    const width = 900
    const height = 600
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".day5_map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr('transform', `translate(0,${margin.top})`)


    const projection_SA4 = d3.geoEquirectangular()
        .fitHeight(height, SA4_topo)



    const pathGenerator_SA4 = d3.geoPath(projection_SA4)



    const SA2 = svg
        .append("g")
        .selectAll("path")
        .data(SA2_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA4)
        .attr("class", "SA2_map")



    const SA3 = svg
        .append("g")
        .selectAll("path")
        .data(SA3_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA4)
        .attr("class", "SA3_map")


    const SA4 = svg
        .append("g")
        .selectAll("path")
        .data(SA4_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA4)
        .attr("class", "SA4_map")






    SA4
        .append("g")
        .select("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "label_poly")
        .text(d => d.properties.SA4_NAME16)
        .attr("x", d => pathGenerator_SA4.centroid(d)[0])
        .attr("y", d => pathGenerator_SA4.centroid(d)[1])
        .call(wrap, 30)

    const points = svg
        .append("g")
        .selectAll("circle")
        .data(museum)
        .join("circle")
        .attr("class", "museum_point")
        .attr("cx", d => projection_SA4([d.lon, d.lat])[0])
        .attr("cy", d => projection_SA4([d.lon, d.lat])[1])
        .attr("r", 6)


    points
        .on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave)

    const tooltip = d3.select("#tooltip")

    function onMouseEnter(i, d) {
        tooltip
            .style("opacity", .9)

        

        tooltip
            .selectAll(".museum")
            .text(name_accessor(d))

        const x = projection_SA4([d.lon, d.lat])[0]
        const y = projection_SA4([d.lon, d.lat])[1]

        tooltip
            .style("transform", `translate(` +
                `calc( ${x}px),` +
                `calc(${y}px)` +
                `)`)
    }

    function onMouseLeave() {
        tooltip
            .style("opacity", 0)
    }

}






drawMap_locations()