async function drawMap_locations() {




    const SA4_map = await d3.json("./../geo/SA4_simple_copy.json")


    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")


    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)



    const location = await d3.csv("./../data/location_factor.csv", function(d) {
        return {
            SA4_NAME16: d.SA4,
            type: d.type,
            factor: +d.factor
        }
    })


    console.log(location)


    // const address_accessor = d => d.geoAddress
    // const partner_accessor = d => d.partner





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


    const width = 500
    const height = 500
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }



    const grouped_data = Array.from(d3.group(location, d => d.type), ([key, value]) => ({ key, value }))

    console.log(grouped_data)





    const svg = d3.select(".location_factor_holder")
        .selectAll("chart")
        .data(grouped_data)
        .join("svg")
        .attr("viewBox", "0 0 500 500")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_SA4 = d3.geoEquirectangular()
        .fitWidth(width, SA4_topo)



    const pathGenerator_SA4 = d3.geoPath(projection_SA4)


    const SA2_name_accessor = d => d.properties["SA2_NAME16"]

    const location_mapped = new Map(location.map(d => [d.SA4_NAME16, d.factor]))

    const max_factor = d3.max(location, d => d.factor)
    const min_factor = d3.min(location, d => d.factor)


    const scale_color = d3.scaleLinear()
        .domain([min_factor, max_factor])
        .range(["white","#ED4611"])



    // // partner_key = d3.group(location, d => d.partner)

    svg
        .append('g')
        .selectAll("text")
        .data(grouped_data)
        .join('text')
        .attr("dy", 15)
        .attr("dx", 20)
        .text(d => d.key)


    const SA4 = svg
        .append("g")
        .selectAll("path")
        .data(SA4_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA4)
        .attr("fill", d => scale_color(location_mapped.get(d.properties.SA4_NAME16)) || "darkgrey")
        .attr("class", "SA4_factor_map")

    SA4
        .select("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "SA4_label")
        .text(d => d.properties.SA4_NAME16.replace("Sydney - ", ""))
        .attr("x", d => pathGenerator_SA4.centroid(d)[0])
        .attr("y", d => pathGenerator_SA4.centroid(d)[1])
        .call(wrap, 80)






        const legend = svg
            .append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(20,40)")

        const legendOrdinal = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
            .shapePadding(10)
            .title("Scope NSW key Locations")
            .scale(scale_color)


        svg
            .select(".legendOrdinal")
            .call(legendOrdinal)


    // property.on("mouseenter", onMouseEnter)
    //     .on("mouseleave", onMouseLeave)

    // const tooltip = d3.select("#tooltip_property")

    // function onMouseEnter(i, d) {
    //     tooltip
    //         .style("opacity", .9)


    //     tooltip
    //         .select("#property_address")
    //         .text(address_accessor(d))

    //     tooltip
    //         .select("#property_partner")
    //         .text(partner_accessor(d))

    //     const x = projection_SA2([d.lon, d.lat])[0]
    //     const y = projection_SA2([d.lon, d.lat])[1]


    //     tooltip
    //         .style("transform", `translate(` +
    //             `calc( ${x}px),` +
    //             `calc(${y}px)` +
    //             `)`)
    // }

    // function onMouseLeave() {
    //     tooltip
    //         .style("opacity", 0)
    // }



}

drawMap_locations()