async function drawUnpaid_Assistance() {


    const schools = await d3.csv("./../data/schools_toongabbie.csv", function(d) {
        return {
            name: d.School_name,
            latitude: +d.Latitude,
            longitude: +d.Longitude
        }
    })

    // console.log(schools)

    const data = await d3.csv("./../data/toongabbie_unpaid_assistance_SA2.csv", function(d) {
        return {
            SA2_NAME16: d.SA2_NAME_2016,
            prop: +d.prop_sa2
        }
    })


    const hospital = await d3.json("./../data/BuildingComplexPoint_EPSG4326.json")

    // hospital.BuildingComplexPoint.features = hospital.BuildingComplexPoint.features.filter(d => d.properties.classsubtype == 3)
    hospital.buildingcomplexpoint.features = hospital.buildingcomplexpoint.features.filter(d => d.properties.generalname == 'westmead hospital' ||
        d.properties.generalname == 'blacktown hospital' || d.properties.generalname == "auburn hospital" || d.properties.generalname == "minchinbury community hospital" ||
        d.properties.generalname == "auburn hospital" || d.properties.generalname == "st joseph's hospital")

    // console.log(hospital)



    const university = await d3.json("./../data/BuildingComplexPoint_EPSG4326.json")


    university.buildingcomplexpoint.features = university.buildingcomplexpoint.features.filter(d =>
        d.properties.generalname == 'university of western sydney westmead campus' || d.properties.generalname == "university of western sydney parramatta nth campus" || d.properties.generalname == "university of western sydney parramatta sth campus" ||
        d.properties.generalname == "university of western sydney blacktown campus")

    // console.log(hospital)

    // const data_mapped = new Map(data.map(d => [d.SA2_NAME16, d.prop]))


    // const max_assistance = d3.max(data, d => d.prop)
    // const min_assistance = d3.min(data, d => d.prop)

    // const scale_color = d3.scaleQuantize([min_assistance, max_assistance], d3.schemeBlues[9])



    // importing mapping data and converting topoJson to Geojson

    const SA3_map = await d3.json("./../geo/SA3_simple_copy.json")

    SA3_map.objects.SA3.geometries = SA3_map.objects.SA3.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    // console.log(SA3_map)

    SA3_topo = topojson.feature(SA3_map, SA3_map.objects.SA3)



    const SA2_map = await d3.json("./../geo/SA2_simple_copy.json")


    SA2_map.objects.SA2.geometries = SA2_map.objects.SA2.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA2_topo = topojson.feature(SA2_map, SA2_map.objects.SA2)


    // console.log(SA2_topo)



    const SA4_map = await d3.json("./../geo/SA4_simple.json")

    SA4_map.objects.SA4.geometries = SA4_map.objects.SA4.geometries.filter(d => d.properties.SA4_NAME16 == "Blacktown" || d.properties.SA4_NAME16 == "Parramatta")

    SA4_topo = topojson.feature(SA4_map, SA4_map.objects.SA4)




    const trains_import = await d3.csv("./../data/tfnsw_train.csv", function(d) {
        return {
            location_name: d.location_name,
            latitude: +d.latitude,
            longitude: +d.longitude,
            SA4: d.SA4

        }
    })

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

    trains = trains_import.filter(d => d.SA4 != "Outer" & (d.SA4 == "Sydney - Parramatta" || d.SA4 == "Sydney - Blacktown"))

    const width = 700
    const height = 600
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }

    const svg = d3.select(".toongabbie_ammenities")
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
        .style("transform", `translate(${
        margin.left
      }, ${
        margin.top
      })`)


    const SA2_colour = ({

        "Toongabbie - Constitution Hill": '#86BF84',
        "Seven Hills - Toongabbie": '#86BF84',

    })


    const SA2_background = map
        .selectAll(".SA2_background")
        .data(SA2_topo.features)
        .join("path")
        .attr("class", "SA2_background")
        .attr("d", pathGenerator)
        .attr("fill", (d) => SA2_colour[d.properties.SA2_NAME16] || "#B5D8DD")



    const SA3_background = map
        .selectAll(".SA3_background")
        .data(SA3_topo.features)
        .join("path")
        .attr("class", "SA3_background")
        .attr("d", pathGenerator)


    const SA4_background = map
        .selectAll(".SA4_background")
        .data(SA4_topo.features)
        .join("path")
        .attr("class", "SA4_background")
        .attr("d", pathGenerator)


    const labels = map
        .selectAll("text")
        .data(SA4_topo.features)
        .join("text")
        .attr("class", "SA4_area_label")
        .text(d => d.properties.SA4_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1])



    labels
        .select("text")
        .data(SA3_topo.features)
        .join("text")
        .attr("class", "SA3_area_label_light")
        .text(d => d.properties.SA3_NAME16)
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1])
        .call(wrap, 50)


    const point = map
        .selectAll("circle")
        .data(trains)
        .join("circle")
        .attr("class", "circle_train")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", 5)


    point
        .select("circle")
        .data(schools)
        .join("circle")
        .attr("class", "circle_school")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", 5)


    // console.log(trains)



    point
        .select("circle2")
        .data(hospital.buildingcomplexpoint.features)
        .join("circle")
        .attr("class", "circle_hospital")
        .attr("cx", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0])
        .attr("cy", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1])
        .attr("r", 5)


    point
        .select("circle2")
        .data(university.buildingcomplexpoint.features)
        .join("circle")
        .attr("class", "circle_education")
        .attr("cx", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0])
        .attr("cy", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1])
        .attr("r", 5)
        .attr("fill", "red")


    labels
        .select("text")
        .data(trains)
        .join("text")
        .attr("class", "train_point_label")
        .text(d => d.location_name)
        .attr("x", d => projection([d.longitude, d.latitude + 0.010])[0])
        .attr("y", d => projection([d.longitude, d.latitude + 0.010])[1])
        .call(wrap, 50)


    labels
        .select("text")
        .data(hospital.buildingcomplexpoint.features)
        .join("text")
        .attr("class", "hospital_point_label")
        .text(d => d.properties.generalname)
        .attr("x", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1] - 0.006])[0])
        .attr("y", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1] - 0.006])[1])
        .attr("font-size", "8px")
        .call(wrap, 60)


    //     labels     
    // .select("text")    
    //     .data(university.buildingcomplexpoint.features)    
    //     .join("text")
    //     .attr("class", "education_point_label")
    //     .text(d => d.properties.generalname)
    //     .attr("x", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0])
    //     .attr("y", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1])
    //     .attr("font-size", "8px")
    //     // .attr("text-anchor", "middle")


const legendGroup = map
        .append("g")
        .attr("transform", `translate(${
         400
       },${
         width <500
         ? height -10
         : height - 10    
       })`)
        // .attr("x", 600)
        // .attr("y", 200)
        .attr("class", "legendGroup")

    

  legendGroup
        .append("text")
        .attr("y", -550)
        .attr("x", 30)
        .attr("class", "legendText")
        .text("Accessible Transport")

        legendGroup
      .append("text")
        .attr("y", -525)
        .attr("x", 30)
        .attr("class", "legendText")
        .text("Hospital")

      
   legendGroup
      .append("text")
        .attr("y", -500)
        .attr("x", 30)
        .attr("class", "legendText")
        .text("School for Specific Purposes")


legendGroup
      .append("text")
        .attr("y", -475)
        .attr("x", 30)
        .attr("class", "legendText")
        .text("University")

 const legendSize = 10

 legendGroup
    .append("circle")
    .attr("cy", -555)
    .attr("cx", 20)
    .attr("r", 5)
    .attr("fill", "#0388A6")

legendGroup
    .append("circle")
    .attr("cy", -530)
    .attr("cx", 20)
    .attr("r", 5)
    .attr("fill", "#D91807")


legendGroup
    .append("circle")
    .attr("cy", -505)
    .attr("cx", 20)
    .attr("r", 5)
    .attr("fill", "#A2A629")


legendGroup
    .append("circle")
    .attr("cy", -480)
    .attr("cx", 20)
    .attr("r", 5)
    .attr("fill", "#D9AC25")


}

drawUnpaid_Assistance()