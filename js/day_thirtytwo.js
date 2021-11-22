async function drawMap_green() {



    const fed_map = await d3.json("./../geo/fed_elect_simple.json")






    fed_topo = topojson.feature(fed_map, fed_map.objects.fed_electorate)

    console.log(fed_topo)



    const green = await d3.csv("./../data/green_votes.csv", function(d) {
            return {
                CED_NAME21: d.DivisionNm,
                swing: +d.Swing

            }
        }

    )


    console.log(green)


    const data_mapped = new Map(green.map(d => [d.CED_NAME21, d.swing]))

    console.log(data_mapped)

    //     const chicken_name = Array.from(new Set(chicken.map(d => d.name)))
    //     console.log(chicken_name)

    //     function wrap(text, width) {
    //         text.each(function() {
    //             var text = d3.select(this),
    //                 words = text.text().split(/\s+/).reverse(),
    //                 word,
    //                 line = [],
    //                 lineNumber = 0,
    //                 lineHeight = 1.1, // ems
    //                 x = text.attr("x"),
    //                 y = text.attr("y"),
    //                 dy = 0, //parseFloat(text.attr("dy")),
    //                 tspan = text.text(null)
    //                 .append("tspan")
    //                 .attr("x", x)
    //                 .attr("y", y)
    //                 .attr("dy", dy + "em");
    //             while (word = words.pop()) {
    //                 line.push(word);
    //                 tspan.text(line.join(" "));
    //                 if (tspan.node().getComputedTextLength() > width) {
    //                     line.pop();
    //                     tspan.text(line.join(" "));
    //                     line = [word];
    //                     tspan = text.append("tspan")
    //                         .attr("x", x)
    //                         .attr("y", y)
    //                         .attr("dy", ++lineNumber * lineHeight + dy + "em")
    //                         .text(word);
    //                 }
    //             }
    //         });
    //     }


    //     // console.log(chicken)



    const width = 1200
    const height = 600
    // const margin = 15
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".day8_map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr('transform', `translate(0,${margin.top})`)


    const projection_fed = d3.geoEquirectangular()
        .fitWidth(width, fed_topo)



    const pathGenerator_fed = d3.geoPath(projection_fed)

    const max_swing = d3.max(green, d => d.swing)
    const min_swing = d3.min(green, d => d.swing)

    console.log(min_swing)

    const swing_colour = d3.scaleLinear()
        .domain([min_swing, 0, max_swing])
        .range(["#FB235F", "white", "#00D628"])

    const fed__set_map = svg
        .append("g")
        .selectAll("path")
        .data(fed_topo.features)
        .join("path")
        .attr("d", pathGenerator_fed)
        .attr("class", "greens_map")
        .attr("fill", d => swing_colour(data_mapped.get(d.properties.CED_NAME21)) || "darkgrey")

    const legend = svg
        .append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)")

    const legendLinear = d3.legendColor()
        .shapeWidth(10)
        .shapeHeight(10)
        .shapePadding(5)
        .cells(10)
        .orient('vertical')
        .scale(swing_colour)
        .title("% swing for Greens 2019")
        // .labelFormat(d3.format(".0%"))


    svg
        .select(".legendLinear")
        .call(legendLinear)






}

drawMap_green()