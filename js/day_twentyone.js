async function drawMap_locations() {


    const LGA_map = await d3.json("./../geo/nsw_lga_topo.json")

    // console.log(LGA_map)

    LGA_map.objects.nsw_lga.geometries = LGA_map.objects.nsw_lga.geometries.filter(d => d.properties.nsw_lga__2 == "COUNCIL OF THE CITY OF SYDNEY")


    LGA_topo = topojson.feature(LGA_map, LGA_map.objects.nsw_lga)

    // console.log(LGA_topo)




const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA3_NAME16 == "Sydney Inner City" )


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)
    
    const tree = await d3.csv("./../data/jacaranda_sydney.csv", function(d) {
        return {
            lon: +d.X,
            lat: +d.Y,
            tree_type: d.TreeType,
            height: +d.TreeHeight, 
            canopy_EW: +d.TreeCanopyEW,
            canopy_EW: +d.TreeCanopyNS


        }
    })

//     console.log(tree)


const height_accessor = d => d.height

    



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

    
    const width = 700
    const height = 700
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".city_map")
        .append("svg")
        .attr("viewBox", "0 0 700 700")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_LGA = d3.geoEquirectangular()
        .fitHeight(height, LGA_topo)



    const pathGenerator_LGA = d3.geoPath(projection_LGA)

    const radius = d3.scaleSqrt([d3.min(tree, d => d.height), d3.max(tree, d => d.height)], [1, 10])

    const LGA = svg
        .append("g")
        .selectAll("path")
        .data(LGA_topo.features)
        .join("path")
        .attr("d", pathGenerator_LGA)
        .attr("class", "SA3_map_no_hover")

        

    
    // const SA2 = LGA
    //     .append("g")
    //     .selectAll("path")
    //     .data(SA2_topo.features)
    //     .join("path")
    //     .attr("d", pathGenerator_LGA)
    //     .attr("class", "SA2_map_no_fill")



const SA2 = LGA
    .append("g")
        .select("text")
        .data(SA2_topo.features)
        .join("text")
        .attr("class", "SA2_label_tree")
        .text(d => d.properties.SA2_NAME16)
        .attr("x", d => pathGenerator_LGA.centroid(d)[0])
        .attr("y", d => pathGenerator_LGA.centroid(d)[1])
        .call(wrap, 70)


    

    const tree_point = svg
        .selectAll("circle")    
        .data(tree)    
        .join("circle")
        .attr("class", "tree_point")
        .attr("cx", d => projection_LGA([d.lon, d.lat])[0])
        .attr("cy", d => projection_LGA([d.lon, d.lat])[1])
        .attr("r", d => radius(d.height))
        // .attr("r", 5)



    const legend = svg
        .append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(20,20)")

    const legendSize = d3.legendSize()
        
  .scale(radius)
  .shape('circle')
        
        .title("Height of Jacaranda Trees (m)")



    svg
        .select(".legendSize")
        .call(legendSize)




    tree_point.on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave)

    const tooltip = d3.select("#tooltip")

    function onMouseEnter(i, d) {
        tooltip
        .style("opacity", .9)


        tooltip
        .select("#height")
            .text(height_accessor(d))

        const x = projection_LGA([d.lon, d.lat])[0]
        const y = projection_LGA([d.lon, d.lat])[1]

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