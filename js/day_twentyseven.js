async function drawMap_locations() {



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)



    const SA3_map = await d3.json("./../geo/SA3_simple_copy.json")


    SA3_map.objects.SA3.geometries = SA3_map.objects.SA3.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney")


    SA3_topo = topojson.feature(SA3_map, SA3_map.objects.SA3)

    console.log(SA3_topo)



    const SA4_map = await d3.json("./../geo/SA4_simple.json")


    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney")


    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)

    console.log(SA4_topo)

    // const home = await d3.csv("./../data/homes.csv", function(d) {
    //     return {
    //         lon: +d.x,
    //         lat: +d.y,
    //         location: d.location,
    //         order: +d.order


    //     }
    // })

    // const home_lines = await d3.csv("./../data/homes_line.csv", function(d) {
    //     return {
    //         lon1: +d.x1,
    //         lon2: +d.x2,
    //         lat1: +d.y1,
    //         lat2: +d.y2,
    //         location: d.location,
    //         order: +d.order


    //     }
    // })


    // // console.log(home_lines)

    // const link = []
    // home_lines.forEach(function(row) {
    //     source = [+row.lon1, +row.lat1]
    //     target = [+row.lon2, +row.lat2]
    //     topush = { type: "LineString", coordinates: [source, target] }
    //     link.push(topush)
    // })





    // // const height_accessor = d => d.height
    // // const tree_accessor = d => d.common_name

    // // const tree_name = Array.from(new Set(tree.map(d => d.common_name)))

    // // console.log(tree_name)


    // // // //     // // wrap text function

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
    const height = 900
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".day3_map")
        .append("svg")
        .attr("viewBox", "0 0 900 900")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_SA4 = d3.geoEquirectangular()
        .fitWidth(width, SA4_topo)



    const pathGenerator_SA4 = d3.geoPath(projection_SA4)



     const SA2 = svg
        .append("g")
        .selectAll("path")
        .data(SA2_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA4)
        .attr("class", "SA2_map_poly")


    
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

    

        



}

drawMap_locations()