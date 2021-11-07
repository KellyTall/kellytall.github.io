async function drawMap_locations_green() {



    const AUS_map = await d3.json("./../geo/AUS_simple.json")
    AUS_topo = topojson.feature(AUS_map, AUS_map.objects.AUS)

    const green = await d3.json("./../data/green_names_OSM.geojson")


    console.log(AUS_topo)




    const width = 500
    const height = 500
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }
    const radius = 4


    const svg = d3.select(".green_map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr('transform', `translate(0,${margin.top})`)


    const projection_AUS = d3.geoEquirectangular()
        .fitWidth(width, AUS_topo)



    const pathGenerator_AUS = d3.geoPath(projection_AUS)

    const greens = await d3.csv("./../data/green_names_OSM.csv", function(d) {
        return {
            lon: +d.lon,
            lat: +d.lat

        }
    })


    const greens_map = greens.map(d => {
        const coords = projection_AUS([+d.lon, +d.lat])
        return Object.assign({ x: coords[0], y: coords[1] }, d)
    })


    const hexgridReds = d3.hexgrid()
        .extent([width, height])
        .geography(AUS_topo)
        .pathGenerator(pathGenerator_AUS)
        .projection(projection_AUS)
        .hexRadius(radius)

    const hexReds = hexgridReds(greens_map)

    colour = d3.scaleSequential(t => {
        return d3.interpolateGreens(Math.pow(t, 20))
    }).domain([...hexReds.grid.extentPointDensity].reverse())



    // const AUS = svg
    //     .append("g")
    //     .selectAll("path")
    //     .data(AUS_topo.features)
    //     .join("path")
    //     .attr("d", pathGenerator_AUS)
    //     .attr("class", "AUS_RGB_map")


    const hex = svg
        .append('g')
        .selectAll('.hex')
        .data(hexReds.grid.layout)
        .enter()
        .append('path')
        .attr('class', 'hex')
        .attr('transform', d => `translate(${d.x} ${d.y})`)
        .attr('d', hexReds.hexagon())
        .style('fill', d => !d.pointDensity ? 'white' : colour(d.pointDensity))
        .style('stroke', '#D9D9D9')
        .style('stroke-width', 1)









}







drawMap_locations_green()


