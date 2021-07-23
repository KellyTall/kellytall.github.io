async function draw_sda_seeking() {


    const data = await d3.csv("./../data/SDA_need_SA3.csv", function(d) {
        return {
            sa3: d.sa3,
            seeking_total: +d.seeking_sda,
            alternative: +d.in_sda_seeking_alternative,
            new: +d. not_in_sda_seeking_dwelling
        }
    })

    // const sortedData = data.slice().sort((a, b) => d3.descending(a.dwellings, b.dwellings))

    // console.log(data)

    const width = 380
    const height = 300
    const margin = { top: 15, right: 10, bottom: 20, left: 110 }

    const svg = d3.select(".toongabbie_SDA_seeking_table")
        .append("svg")
        .data(data)
        .attr("width", width)
        .attr("height", height)
        

    const headers = svg
        .append("g")

    headers
        .append("text")
        .join("text")
        .attr("x", 150)
        .attr("y", 20)
        .attr("class", "sda_seek")
        .text("All Seeking")
    
    
    headers
        .append("text")
        .join("text")
        .attr("x", 240)
        .attr("y", 20)
        .attr("class", "sda_seek")
        .text("New accom")
       

    headers
        .append("text")
        .join("text")
        .attr("x", 320)
        .attr("y", 15)
        .attr("class", "sda_seek")
        .text("Alternative")
        

    headers
        .append("text")
        .join("text")
        .attr("x", 320)
        .attr("y", 30)
        .attr("class", "sda_seek")
        .text("accom")
    

    const groups = svg
        .append("g")
        .selectAll("list")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => { return `translate(0, ${i*24})` })



    groups
        .append("text")
        .data(data)
        .join("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("class", "sa3_name")
        .text(d => d.sa3 )
        .attr(`transform`, `translate(0, ${margin.top*3})` )
            
    

    groups
        .append("text")
        .data(data)
        .join("text")
        .attr("x", 150)
        .attr("y", 20)
        .attr("class", "sda_seek")
        .text(d => d.seeking_total )
        .attr(`transform`, `translate(0, ${margin.top*3})` )


    groups
        .append("text")
        .data(data)
        .join("text")
        .attr("x", 240)
        .attr("y", 20)
        .attr("class", "sda_seek")
        .text(d => d.new )
        .attr(`transform`, `translate(0, ${margin.top*3})` )

    groups
        .append("text")
        .data(data)
        .join("text")
        .attr("x", 320)
        .attr("y", 20)
        .attr("class", "sda_seek")
        .text(d => d.alternative )
        .attr(`transform`, `translate(0, ${margin.top*3})` )
    

}

draw_sda_seeking()