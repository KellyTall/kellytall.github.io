async function drawMap_topo() {


    const SA2_map_nbeaches = await d3.json("./../geo/SA2_simple.json")



    SA2_map_nbeaches.objects.SA2.geometries = SA2_map_nbeaches.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Sydney - Northern Beaches")

    // console.log(SA2_map_nbeaches)


    SA2_topo_nbeaches = topojson.feature(SA2_map_nbeaches, SA2_map_nbeaches.objects.SA2)

    // console.log(SA2_topo_nbeaches)

    const trains_import = await d3.csv("./../data/tfnsw_train.csv", function(d) {
        return {
            location_name: d.location_name,
            latitude: +d.latitude,
            longitude: +d.longitude,
            SA4: d.SA4

        }
    })

    trains = trains_import.filter(d => d.SA4 != "Outer" & d.SA4 == "Sydney - Northern Beaches")

    // console.log(trains)

    const width = 700
    const height = 900
    const margin = { top: 40, right: 50, bottom: 10, left: 100 }



    const svg_big_map = d3.select(".map_nbeaches")
        .append("svg")
        .attr("viewBox", "0 0 700 900")
        .attr('transform', `translate(${margin.left},${margin.top})`)

    const projection_SA2 = d3.geoEquirectangular()
        .fitHeight(height, SA2_topo_nbeaches)

    const pathGenerator_SA2 = d3.geoPath(projection_SA2)

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




    const background = svg_big_map
        .append("g")

        .selectAll(".background")
        .data(SA2_topo_nbeaches.features)
        .join("path")
        .attr("class", "SA4_big_map")
        .attr("d", pathGenerator_SA2)


    const labels = svg_big_map
        .append("g")
        .selectAll("text")
        .data(SA2_topo_nbeaches.features)
        .join("text")
        .attr("class", "area_label_extra_small")
        .text(d => d.properties.SA2_NAME16)
        .attr("x", d => pathGenerator_SA2.centroid(d)[0])
        .attr("y", d => pathGenerator_SA2.centroid(d)[1])

    const points = svg_big_map
        .append("g")
        .selectAll("circle")
        .data(trains)
        .join("circle")
        .attr("class", "circle")
        .attr("cx", d => projection_SA2([d.longitude, d.latitude])[0])
        .attr("cy", d => projection_SA2([d.longitude, d.latitude])[1])
        .attr("r", 4)

    const point_label = svg_big_map
        .append("g")
        .selectAll("text")
        .data(trains)
        .join("text")
        .attr("class", "point_label")
        .text(d => d.location_name)
        .attr("x", d => projection_SA2([d.longitude, d.latitude - .003])[0])
        .attr("y", d => projection_SA2([d.longitude, d.latitude - .003])[1])





}

drawMap_topo()