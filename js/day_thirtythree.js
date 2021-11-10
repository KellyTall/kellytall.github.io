async function drawMap_streets() {



    const streets = await d3.json("./../geo/mville_streets_OSM.geojson")



    console.log(streets)

    //     const home = await d3.csv("./../data/homes.csv", function(d) {
    //         return {
    //             lon: +d.x,
    //             lat: +d.y,
    //             location: d.location,
    //             order: +d.order


    //         }
    //     })

    //     const home_lines = await d3.csv("./../data/homes_line.csv", function(d) {
    //         return {
    //             lon1: +d.x1,
    //             lon2: +d.x2,
    //             lat1: +d.y1,
    //             lat2: +d.y2,
    //             location: d.location,
    //             order: +d.order


    //         }
    //     })


    //     // console.log(home_lines)

    //     const link = []
    //     home_lines.forEach(function(row) {
    //         source = [+row.lon1, +row.lat1]
    //         target = [+row.lon2, +row.lat2]
    //         topush = { type: "LineString", coordinates: [source, target] }
    //         link.push(topush)
    //     })


    // console.log(link)




    //     // // //     // // wrap text function

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


    const width = 800
    const height = 900
    // const margin = 15
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".day9_map")
        .append("svg")
        .attr("viewBox", "0 0 900 900")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_streets = d3.geoEquirectangular()
        .fitWidth(height, streets)


    const pathGenerator_streets = d3.geoPath(projection_streets)


    const width_scale = d3.scaleLinear()
        .domain([5, 13]) // input values will be between 0 and 5
        .range([0.1, 8]) //


    const map_streets = svg
        .append("g")
        .selectAll("path")
        .data(streets.features)
        .join("path")
        .attr("d", pathGenerator_streets)
        .attr("class", "map_streets")
        .attr('stroke-width', d =>  width_scale(d.properties.width))

}

drawMap_streets()