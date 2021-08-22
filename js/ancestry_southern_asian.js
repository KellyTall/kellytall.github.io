async function drawMap_topo() {


        const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


        SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")


        SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)

        // console.log(SA2_topo)


        const SA4_map = await d3.json("./../geo/SA4_simple_copy.json")


        SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")


        SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)

        // console.log(SA2_topo)





        const data = await d3.csv("./../data/south_asian_ancestry.csv", function(d) {
            return {
                SA2_NAME16: d.SA2_NAME16,
                prop: +d.pop_prop,
                area_diff: +d.area_diff
            }
        })


        const SA2_name_accessor = d => d.properties["SA2_NAME16"]

        const data_mapped = new Map(data.map(d => [d.SA2_NAME16, d.area_diff]))





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

        const max_prop = d3.max(data, d => d.area_diff)
        const min_prop = d3.min(data, d => d.area_diff)


        const scale_color = d3.scaleLinear()
            .domain([min_prop, 0, max_prop])
            .range(["#90DDB4", "white", "#ED4611"])



        const width = 700
        const height = 700
        const margin = { top: 30, right: 40, bottom: 10, left: 10 }


        const svg_sa = d3.select(".south_asian_map")
            .append("svg")
            .attr("viewBox", "0 0 700 700")
            .attr('transform', `translate(0,${margin.top})`)


        const projection_SA2 = d3.geoEquirectangular()
            .fitWidth(width, SA2_topo)



        const pathGenerator_SA2 = d3.geoPath(projection_SA2)



        const SA2_sa = svg_sa
            .append("g")
            .selectAll(".map")
            .data(SA2_topo.features)
            .join("path")
            .attr("d", pathGenerator_SA2)
            .attr("fill", d => scale_color(data_mapped.get(d.properties.SA2_NAME16)) || "darkgrey")
            .attr("class", "SA2_map")

        const SA4_sa = svg_sa
            .append("g")
            .selectAll(".map")
            .data(SA4_topo.features)
            .join("path")
            .attr("d", pathGenerator_SA2)
            // .attr("fill", d => scale_color(data_mapped.get(d.properties.SA2_NAME16)) || "darkgrey")
            .attr("class", "SA4_map")

        SA4_sa
            .select("text")
            .data(SA4_topo.features)
            .join("text")
            .attr("class", "SA4_label")
            .text(d => d.properties.SA4_NAME16.replace("Sydney - ", ""))
            .attr("x", d => pathGenerator_SA2.centroid(d)[0])
            .attr("y", d => pathGenerator_SA2.centroid(d)[1])
            .call(wrap, 110)



        const legend = svg_sa
            .append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(0,20)")

        const legendLinear = d3.legendColor()
            .shapeWidth(10)
            .shapeHeight(10)
            .shapePadding(5)
            .cells(10)
            .orient('vertical')
            .scale(scale_color)
            .title("Difference from Greater Sydney average")
            .labelFormat(d3.format(".0%"))


        svg_sa
            .select(".legendLinear")
            .call(legendLinear)



                SA2_sa.on("mouseenter", onMouseEnter)
                    .on("mouseleave", onMouseLeave)

                const tooltip_sa = d3.select("#tooltip_sa")

                function onMouseEnter(i, d) {
                    tooltip_sa
                        .style("opacity", .9)


                    tooltip_sa
                        .select("#sa2_sa")
                        .text(SA2_name_accessor(d))

                    tooltip_sa
                        .select("#value_sa")
                        .text(`${d3.format(".0%")(data_mapped.get(d.properties.SA2_NAME16) || "NA")}`)

                    const x = pathGenerator_SA2.centroid(d)[0]
                    const y = pathGenerator_SA2.centroid(d)[1]


                    tooltip_sa
                    .style("transform", `translate(` +
                        `calc( ${x}px),` +
                        `calc(${y}px)` +
                        `)`)
                }

                function onMouseLeave() {
                    tooltip_sa
                    .style("opacity", 0)
                }


            }

        drawMap_topo()