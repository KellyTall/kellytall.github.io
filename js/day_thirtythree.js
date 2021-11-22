async function drawMap_streets() {



    const streets = await d3.json("./../geo/mville_streets_OSM.geojson")



    // console.log(streets)

    

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