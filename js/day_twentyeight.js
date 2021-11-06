async function drawMap_locations() {


    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA3_NAME16 == "Sydney Inner City" || d.properties.SA2_NAME16 == "Paddington - Moore Park")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)








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
    const radius = 4



    const svg = d3.select(".day4_map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr('transform', `translate(0,${margin.top})`)





    const projection_SA2 = d3.geoEquirectangular()
        .fitWidth(width, SA2_topo)



    const pathGenerator_SA2 = d3.geoPath(projection_SA2)

    const trees = await d3.csv("./../data/cos_tree.csv", function(d) {
        return {
            lon: +d.lon,
            lat: +d.lat

        }
    })


    const trees_map = trees.map(d => {
        const coords = projection_SA2([+d.lon, +d.lat])
        return Object.assign({ x: coords[0], y: coords[1] }, d)
    })

    // console.log(trees_map)


    const hexgridTrees = d3.hexgrid()
        .extent([width, height])
        .geography(SA2_topo)
        .pathGenerator(pathGenerator_SA2)
        .projection(projection_SA2)
        .hexRadius(radius)

    const hexTrees = hexgridTrees(trees_map)


    // console.log(hexTrees.grid.layout)


    colour = d3.scaleSequential(t => {
        return d3.interpolateYlGn(Math.pow(t, 20))
    }).domain([...hexTrees.grid.extentPointDensity].reverse())

    

    const hex = svg
        .append('g')
        .selectAll('.hex')
        .data(hexTrees.grid.layout)
        .enter()
        .append('path')
        .attr('class', 'hex')
        .attr('transform', d => `translate(${d.x} ${d.y})`)
        .attr('d', hexTrees.hexagon())
        .style('fill', d => !d.pointDensity ? 'white' : colour(d.pointDensity))
        .style('stroke', '#ccc')
        .style('stroke-width', 1)

        const SA2 = svg
        .append("g")
        .selectAll("path")
        .data(SA2_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA2)
        .attr("class", "SA2_map_poly")



  



}

drawMap_locations()