
async function drawBars () {

const data = await d3.csv("data/gender_bar_wide.csv")



   dimensions = ({  
        height:400,
        width:900,  
        margin: {
            top: 10,
            right: 30,
            bottom: 20,
            left: 50,
          } 
  })



    groups = d3.map(dataset, d => d.year).keys()

    console.log(groups)


    subgroups = dataset.columns.slice(1)

    stackedData = d3.stack()
    .keys(subgroups)
    (dataset)

    console.log(stackedData)


    yScale = d3.scaleLinear()
        .domain([0, 2500])
        .range([ dimensions.height, 0 ]);


    xScale = d3.scaleBand()
        .domain(groups)
        .range([0, dimensions.width])
        .padding([0.2])

      color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#214151','#f8dc81'])


  

  

const svg = d3.select("#wrapper")
        .append("svg")
          .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
          .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")")  



  
    svg.append("g")
      .selectAll("g")
    
    .data(stackedData)
    .enter()
    .append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
     
      .data(d => d)
      .enter()
      .append("rect")
        .attr("class", "hello")
        .attr("x", d => xScale(d.data.year))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width",xScale.bandwidth())
        .




        on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
              var xPosition = d3.mouse(this)[0] - 15;
              var yPosition = d3.mouse(this)[1] - 25;
              var subgroupName = d3.select(this.parentNode).datum().key;
              var subgroupValue = d.data[subgroupName];
              tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
              tooltip.select("text").text(subgroupName + " " + subgroupValue);
            });


var tooltip = svg.append("g")
          .attr("class", "tooltip")
          .style("display", "none");
            
        tooltip.append("rect")
          .attr("width", 80)
          .attr("height", 20)
          .attr("fill", "white")
          .style("opacity", 0.8);

        tooltip.append("text")
          .attr("x", 15)
          .attr("dy", "1.2em")
          .style("text-anchor", "middle")
          .attr("font-size", "20px")
          .attr("font-weight", "bold");
  

  svg.append("g")
    .attr("transform", "translate(0," + dimensions.height + ")")
    .call(d3.axisBottom(xScale).tickSizeOuter(0));
  
  svg.append("g")
    .call(d3.axisLeft(yScale));
  
  



}

drawBars()



