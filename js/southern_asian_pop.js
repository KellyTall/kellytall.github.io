async function drawMap_topo() {


    const SA2_map = await d3.json("./../geo/SA2_simple.json")




    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")
    console.log(SA2_map)


    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)


    // const SA4_map = await d3.json("./../geo/SA4_simple.json")

    // SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.GCC_NAME16 == "Greater Sydney" & d.properties.SA4_NAME16 != "Central Coast")

    // SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)


    // console.log(SA2_topo)



    const data = await d3.csv("./../data/south_asian_ancestry.csv", function(d) {
        return {
            SA2_NAME16: d.SA2_NAME16,
            prop: +d.pop_prop,
            area_diff: +d.area_diff
        }
    })

   
    console.log(data)

    const data_mapped = new Map(data.map(d => [d.SA2_NAME16, d.area_diff]))

    console.log(data_mapped)

    const max_prop = d3.max(data, d => d.area_diff)
    const min_prop = d3.min(data, d => d.area_diff)

    

    const scale_color = d3.scaleLinear()
        .domain([min_prop, 0, max_prop])
        .range(["#90DDB4", "white", "#B35334"])




    const width = 800
    const height = 800
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }


    const svg = d3.select(".south_asian_map")
        .append("svg")
        .attr("viewBox", "0 0 900 900")


    const projection_SA2 = d3.geoEquirectangular()
        .fitWidth(width, SA2_topo)



    const pathGenerator_SA2 = d3.geoPath(projection_SA2)


    const [
        [x0, y0],
        [x1, y1]
    ] = pathGenerator_SA2.bounds(SA2_topo)


    const map = svg
        .append("g")


    const SA2 = svg
        .selectAll(".background")
        .data(SA2_topo.features)
        .join("path")
        .attr("class", "SA2_ancestry")
        .attr("d", pathGenerator_SA2)
        .attr("fill", d => scale_color(data_mapped.get(d.properties.SA2_NAME16)) || "darkgrey")





   





}

drawMap_topo()