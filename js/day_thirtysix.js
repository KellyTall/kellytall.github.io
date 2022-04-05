async function drawMap_green() {



    const fed_map = await d3.json("./../geo/fed_elect_simple.json")






    fed_topo = topojson.feature(fed_map, fed_map.objects.fed_electorate)

    // console.log(fed_topo)



    const green = await d3.csv("./../data/green_votes.csv", function(d) {
            return {
                CED_NAME21: d.DivisionNm,
                swing: +d.Swing

            }
        }

    )


    // console.log(green)


    const data_mapped = new Map(green.map(d => [d.CED_NAME21, d.swing]))

    // console.log(data_mapped)





    const width = 1200
    const height = 600
    // const margin = 15
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }
    const radius = 4

    const svg = d3.select(".day12_map")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr('transform', `translate(0,${margin.top})`)


    const projection_fed = d3.geoEquirectangular()
        .fitWidth(width, fed_topo)



    const pathGenerator_fed = d3.geoPath(projection_fed)

    

    const fed__set_map = svg
        .append("g")
        .selectAll("path")
        .data(fed_topo.features)
        .join("path")
        .attr("d", pathGenerator_fed)
        .attr("class", "greens_map")
        .attr("fill", "white")

    const frogmouth = await d3.csv("./../data/tawny_frogmouth.csv", function(d) {
        return {
            lon: +d.lon,
            lat: +d.lat

        }
    })

    const frogmouth_map = frogmouth.map(d => {
        const coords = projection_fed([+d.lon, +d.lat])
        return Object.assign({ x: coords[0], y: coords[1] }, d)
    })

    // console.log(frogmouth_map)

    const hexgrid_frogmouth = d3.hexgrid()
        .extent([width, height])
        .geography(fed_topo)
        .pathGenerator(pathGenerator_fed)
        .projection(projection_fed)
        .hexRadius(radius)

    const hex_frogmouth = hexgrid_frogmouth(frogmouth_map)

    colour = d3.scaleSequential(t => {
            return d3.interpolateGreys(Math.pow(t, 100))
        })
        .domain([...hex_frogmouth.grid.extentPointDensity]
            .reverse())




    const hex = svg
        .append('g')
        .selectAll('.hex')
        .data(hex_frogmouth.grid.layout)
        .enter()
        .append('path')
        .attr('class', 'hex')
        .attr('transform', d => `translate(${d.x} ${d.y})`)
        .attr('d', hex_frogmouth.hexagon())
        .style('fill', d => !d.pointDensity ? 'white' : colour(d.pointDensity))
        // .style("fill", "white")
        .style('stroke', 'white')
        .style('stroke-width', 1)


    // const legend = svg
    //     .append("g")
    //     .attr("class", "legendLinear")
    //     .attr("transform", "translate(20,20)")

    // const legendLinear = d3.legendColor()
    //     .shapeWidth(10)
    //     .shapeHeight(10)
    //     .shapePadding(5)
    //     .cells(10)
    //     .orient('vertical')
    //     .scale(swing_colour)
    //     .title("% swing for Greens 2019")
    //     // .labelFormat(d3.format(".0%"))


    // svg
    //     .select(".legendLinear")
    //     .call(legendLinear)






}

drawMap_green()