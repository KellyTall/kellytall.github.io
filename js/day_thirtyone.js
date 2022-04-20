async function drawMap_rooster() {



    const rooster = await d3.json("./../geo/red_rooster_wall.geojson")



    console.log(rooster)

    

    const width = 800
    const height = 900
    // const margin = 15
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".day7_map")
        .append("svg")
        .attr("viewBox", "0 0 900 900")
        .attr('transform', `translate(0,${margin.top})`)


    const projection_rooster = d3.geoEquirectangular()
        .fitWidth(height, rooster)


    const pathGenerator_rooster = d3.geoPath(projection_rooster)


    // const width_scale = d3.scaleLinear()
    //     .domain([5, 13]) // input values will be between 0 and 5
    //     .range([0.1, 8]) //


    const tree_point = svg
            .selectAll("circle")
            .data(rooster.features)
            .join("circle")
            .attr("class", "tree_point")
            .attr("cx", d => projection_SA2([d.lon, d.lat])[0])
            .attr("cy", d => projection_SA2([d.lon, d.lat])[1])
            .attr("r", d => radius(d.height))
            
}

drawMap_rooster()