async function drawMap_locations() {


    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)


    const SA4_map = await d3.json("./../geo/SA4_simple_copy.json")


    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")


    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)



    const location = await d3.csv("./../data/geo_coded_location.csv", function(d) {
        return {
            geoAddress: d.geoAddress,
            lon: +d.lon,
            lat: +d.lat,
            partner: d.Partner
        }
    })


    // console.log(location)


    const address_accessor = d => d.geoAddress
    const partner_accessor = d => d.partner





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


    const width = 900
    const height = 900
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".scope_locations")
        .append("svg")
        .attr("viewBox", "0 0 900 900")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_SA2 = d3.geoEquirectangular()
        .fitWidth(width, SA2_topo)



    const pathGenerator_SA2 = d3.geoPath(projection_SA2)

    

    // partner_key = d3.group(location, d => d.partner)

    

    const colour = d3.scaleOrdinal()
        .range(["#FF0000", "#00A08A", "#F2AD00", "#F98400", "#5BBCD6"])




    const SA2 = svg
        .append("g")
        .selectAll("path")
        .data(SA2_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA2)
        .attr("class", "SA2_map_no_hover")

    const SA4 = svg
        .append("g")
        .selectAll("path")
        .data(SA4_topo.features)
        .join("path")
        .attr("d", pathGenerator_SA2)
        .attr("class", "SA4_map")

    SA4
        .select("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "SA4_label")
        .text(d => d.properties.SA4_NAME16.replace("Sydney - ", ""))
        .attr("x", d => pathGenerator_SA2.centroid(d)[0])
        .attr("y", d => pathGenerator_SA2.centroid(d)[1])
        .call(wrap, 80)

    const property = svg
        .append('g')
        .selectAll("circle")
        .data(location)
        .join("circle")
        .attr("class", "location_circle")
        .attr("cx", d => projection_SA2([d.lon, d.lat])[0])
        .attr("cy", d => projection_SA2([d.lon, d.lat])[1])
        .attr("r", 10)
        .attr("fill", d => colour([d.partner]))



    const legend = svg
        .append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(20,40)")

    const legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
        .shapePadding(10)
        .title("Scope NSW key Locations")
        .scale(colour)


    svg
        .select(".legendOrdinal")
        .call(legendOrdinal)


    property.on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave)

    const tooltip = d3.select("#tooltip_property")

    function onMouseEnter(i, d) {
        tooltip
            .style("opacity", .9)


        tooltip
            .select("#property_address")
            .text(address_accessor(d))

        tooltip
            .select("#property_partner")
            .text(partner_accessor(d))

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