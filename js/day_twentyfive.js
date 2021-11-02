async function drawMap_locations() {



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA3_NAME16 == "Sydney Inner City" || d.properties.SA2_NAME16 == "Paddington - Moore Park")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

    const tree = await d3.csv("./../data/moreton_bay_fig.csv", function(d) {
        return {
            lon: +d.X,
            lat: +d.Y,
            common_name: d.CommonName,
            height: +d.TreeHeight

        }
    })



    console.log(tree)


    const height_accessor = d => d.height
    const tree_accessor = d => d.common_name

    const tree_name = Array.from(new Set(tree.map(d => d.common_name)))

    console.log(tree_name)


    // //     // // wrap text function

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


    const svg = d3.select(".day1_map")
        .append("svg")
        .attr("viewBox", "0 0 700 700")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_SA2 = d3.geoEquirectangular()
        .fitHeight(height, SA2_topo)



    const pathGenerator_SA2 = d3.geoPath(projection_SA2)

    const radius = d3.scaleSqrt([d3.min(tree, d => d.height), d3.max(tree, d => d.height)], [1, 20])



    


    
    //     // const tree_colour = ({
    //     //     "Jacaranda": '#9096D1',
    //     //     "Crepe Myrtle": '#D1A5A6'
    //     // })



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
            .call(wrap, 75)


        const tree_point = svg
            .selectAll("circle")
            .data(tree)
            .join("circle")
            .attr("class", "tree_point")
            .attr("cx", d => projection_SA2([d.lon, d.lat])[0])
            .attr("cy", d => projection_SA2([d.lon, d.lat])[1])
            .attr("r", d => radius(d.height))
            
            






        const legend = svg
            .append("g")
            .attr("class", "legendSize")
            .attr('transform', `translate(${width-margin.top*3}, ${height-width/3.5})`)

        const legendSize = d3.legendSize()
            .scale(radius)
            .shape('circle')
            .orient('vertical')
            .title("Height of tree (m)")
            .shapePadding(2)

        svg
            .select(".legendSize")
            .call(legendSize)


      


        tree_point
            .on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave)

        const tooltip = d3.select("#tooltip")

        function onMouseEnter(i, d) {
            tooltip
                .style("opacity", .9)

            tooltip
                .selectAll("#height")
                .text(height_accessor(d))

            tooltip
                .selectAll("#tree")
                .text(tree_accessor(d))

            const x = projection_SA2([d.lon, d.lat])[0]
            const y = projection_SA2([d.lon, d.lat])[1]

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