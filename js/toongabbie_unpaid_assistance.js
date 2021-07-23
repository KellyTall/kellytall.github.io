async function drawUnpaid_Assistance() {


    const data = await d3.csv("./../data/toongabbie_unpaid_assistance_SA2.csv", function(d) {
        return {
            SA2_NAME16: d.SA2_NAME_2016,
            prop: +d.prop_sa2
        }
    })

    const data_mapped = new Map(data.map(d => [d.SA2_NAME16, d.prop]))


    const max_assistance = d3.max(data, d => d.prop)
    const min_assistance = d3.min(data, d => d.prop)

    const scale_color = d3.scaleQuantize([min_assistance, max_assistance], d3.schemeBlues[7])



    // importing mapping data and converting topoJson to Geojson

    const SA3_map = await d3.json("./../geo/SA3_simple_copy.json")

    SA3_map.objects.SA3.geometries = SA3_map.objects.SA3.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA3_topo = topojson.feature(SA3_map, SA3_map.objects.SA3)



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)


    console.log(SA2_topo)



    const SA4_map = await d3.json("./../geo/SA4_simple.json")

    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)

    const width = 300
    const height = 300
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }

    const svg = d3.select(".toongabbie_unpaid_assistance")
        .append("svg")
        .attr("width", width)
    .attr("height", height)


    const projection = d3.geoEquirectangular()
        .fitWidth(height, SA3_topo)



    const pathGenerator = d3.geoPath(projection)


    // const [
    //     [x0, y0],
    //     [x1, y1]
    // ] = pathGenerator.bounds(SA3_topo)


    // height = y1




    const map = svg
        .append("g")
      //   .style("transform", `translate(${
      //   margin.left
      // }px, ${
      //   margin.top
      // }px)`)


        const SA2_colour = ({

        "Toongabbie - Constitution Hill": '#86BF84',
        "Seven Hills - Toongabbie": '#86BF84',

    })


    // const SA3_background = map
    //     .selectAll(".SA3_background")
    //     .data(SA3_topo.features)
    //     .join("path")
    //     .attr("class", "SA3_dwelling_map")
    //     .attr("d", pathGenerator)
    //     .attr("fill", d => scale_color(data_mapped.get(d.properties.SA3_NAME16)))



    const SA2_background = map
        .selectAll(".SA2_background")
        .data(SA2_topo.features)
        .join("path")
        .attr("class", "SA2_background")
        .attr("d", pathGenerator)
        .attr("fill", d => scale_color(data_mapped.get(d.properties.SA2_NAME16)))





}

drawUnpaid_Assistance()