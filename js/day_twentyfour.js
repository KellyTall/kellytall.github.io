async function drawMap_locations() {



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA3_NAME16 == "Sydney Inner City" || d.properties.SA2_NAME16 == "Paddington - Moore Park")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

    const tree = await d3.csv("./../data/flower_tree.csv", function(d) {
        return {
            lon: +d.x,
            lat: +d.y,
            common_name: d.common_name,
            height: +d.tree_height


        }
    })

    // console.log(tree)


    const height_accessor = d => d.height
    const tree_accessor = d => d.common_name

    const tree_name = Array.from(new Set(tree.map(d => d.common_name)))

    console.log(tree_name)


    //     // // wrap text function

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


    const svg = d3.select(".tree_map_filter")
        .append("svg")
        .attr("viewBox", "0 0 700 700")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_SA2 = d3.geoEquirectangular()
        .fitHeight(height, SA2_topo)



    const pathGenerator_SA2 = d3.geoPath(projection_SA2)

    const radius = d3.scaleSqrt([d3.min(tree, d => d.height), d3.max(tree, d => d.height)], [1, 10])



    const place_trees = function() {


        // let inputX = document.querySelector("select[name=valueX]")

        // let valueX = inputX.value

        // let textX = inputX.options[inputX.selectedIndex].innerHTML

        // axisXText.text(textX)

        // const tree_colour = ({
        //     "Jacaranda": '#9096D1',
        //     "Crepe Myrtle": '#D1A5A6'
        // })



        const SA2 = svg
            .append("g")
            .selectAll("path")
            .data(SA2_topo.features)
            .join("path")
            .attr("d", pathGenerator_SA2)
            .attr("class", "SA2_map_22")


        const colour = d3.scaleOrdinal()
            .domain(tree_name)
            .range(["#9096D1", "#D1A5A6"])




        d3.select(".selector")
            .selectAll('myOptions')
            .data(tree)
            .enter()
            .append('option')
            .text(function(d) { return d; }) // text showed in the menu
            .attr("value", function(d) { return d; }) // corresponding value returned by the button

        SA2
            .append("g")
            .select("text")
            .data(SA2_topo.features)
            .join("text")
            .attr("class", "SA2_label_tree")
            .text(d => d.properties.SA2_NAME16)
            .attr("x", d => pathGenerator_SA2.centroid(d)[0])
            .attr("y", d => pathGenerator_SA2.centroid(d)[1])
            .call(wrap, 95)




        const tree_point = svg
            .selectAll("circle")
            .data(tree)
            .join("circle")
            .attr("class", "tree_point")
            .attr("cx", d => projection_SA2([d.lon, d.lat])[0])
            .attr("cy", d => projection_SA2([d.lon, d.lat])[1])
            .attr("r", d => radius(d.height))
            // .attr("fill", (d) => tree_colour[d.common_name] || 'none')
            .attr("fill", d => colour([d.common_name]) || 'none')






        const legend = svg
            .append("g")
            .attr("class", "legendSize")
            .attr("transform", "translate(20,20)")

        const legendSize = d3.legendSize()
            .scale(radius)
            .shape('circle')
            .orient('horizontal')
            .title("Height of tree (m)")
            .shapePadding(15)

        svg
            .select(".legendSize")
            .call(legendSize)


        const legend2 = svg
            .append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(20,100)")

        const legendOrdinal = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolCircle).size(120)())
            .shapePadding(10)
            .title("Type of tree")
            .scale(colour)

        svg
            .select(".legendOrdinal")
            .call(legendOrdinal)


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

    place_trees()

}

drawMap_locations()