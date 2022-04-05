async function drawMap_locations() {



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "City and Inner South" || d.properties.SA4_NAME16 == "Eastern Suburbs" || d.properties.SA4_NAME16 == "Inner West")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

    // console.log(SA2_topo)

    const home = await d3.csv("./../data/homes.csv", function(d) {
        return {
            lon: +d.x,
            lat: +d.y,
            location: d.location,
            order: +d.order


        }
    })

    const home_lines = await d3.csv("./../data/homes_line.csv", function(d) {
        return {
            lon1: +d.x1,
            lon2: +d.x2,
            lat1: +d.y1,
            lat2: +d.y2,
            location: d.location,
            order: +d.order


        }
    })


    // console.log(home_lines)

    const link = []
    home_lines.forEach(function(row) {
        source = [+row.lon1, +row.lat1]
        target = [+row.lon2, +row.lat2]
        topush = { type: "LineString", coordinates: [source, target] }
        link.push(topush)
    })


console.log(link)


    

    // // //     // // wrap text function

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


    const width = 1000
    const height = 700
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".day2_map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr('transform', `translate(0,${margin.top})`)


    const projection_SA2 = d3.geoEquirectangular()
        .fitHeight(height, SA2_topo)



    const pathGenerator_SA2 = d3.geoPath(projection_SA2)

  
    const SA2 = svg
        .append("g")
        .selectAll("path")
        .data(SA2_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA2)
        .attr("class", "SA2_map")



    SA2
        .append("g")
        .select("text")
        .data(SA2_topo.features)
        .join("text")
        .attr("class", "label_tree")
        .text(d => d.properties.SA2_NAME16)
        .attr("x", d => pathGenerator_SA2.centroid(d)[0])
        .attr("y", d => pathGenerator_SA2.centroid(d)[1])
        .call(wrap, 65)

    const lines = svg
        .append("g")
        .selectAll("path")
        .data(link)
        .join("path")
        .attr("class", "line_homes")
        .attr("d", function(d) { return pathGenerator_SA2(d) })




    const home_point = svg
        .append("g")
        .selectAll("circle")
        .data(home)
        .join("circle")
        .attr("class", "home_point")
        .attr("cx", d => projection_SA2([d.lon, d.lat])[0])
        .attr("cy", d => projection_SA2([d.lon, d.lat])[1])
        .attr("r", 10)

    home_point
        .select("text")
        .data(home)
        .join("text")
        .attr("class", "label_home")
        .text(d => d.order)
        .attr("x", d => projection_SA2([d.lon, d.lat])[0])
        .attr("y", d => projection_SA2([d.lon, d.lat])[1])
        .call(wrap, 65)






  





}

drawMap_locations()