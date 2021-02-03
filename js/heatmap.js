async function drawHeatmap() {

 let dataset = await d3.csv("data/time_series_diff.csv", function (d) {return{

 	week_diff: +d.week_diff,
 	n: +d.n,
 	honour: d.award_label

 }
})

console.log(dataset)


 //set dimensions

 var margin = {top: 30, right: 100, bottom: 30, left: 30},
  width = 1000 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;



  //draw canvas

  const svg = d3.select(".heat_map")
	.append("svg")
  	.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)
	.append("g")
  	.attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// array of honour levels
const honour_level = Array.from(d3.group(dataset, d => d.honour).keys())	

// array of weeks
const weeks = Array.from(d3.group(dataset, d => d.week_diff).keys()).sort(d3.ascending)	



console.log(weeks)
console.log(honour_level)


// Build X scales and axis:

const xScale = d3.scaleBand()
		  .domain(weeks)
      .range([ 0, width ])
		  .paddingInner(0.3)
      .paddingOuter(0.4)
      .align(0.5)



const xAxis = d3.axisBottom()
  .scale(xScale)
  .tickValues([-52, -25, 0, 25, 52]);

  svg
    .append("g")
     .call(xAxis) 
      .attr("transform", "translate(0," + height + ")")



// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x))




const yScale = d3.scaleBand()
  .domain(honour_level)
  .range([ height, 0 ])
  .padding(0.01)


svg.append("g")
  .call(d3.axisLeft(yScale))



const max_page = d => d.n

const myColor = d3.scaleLinear()
  .domain(d3.extent(dataset, max_page))
  .range(["#d6dec8","#214151"])


//tooltip


const tooltip = d3.select(".heat_map_tooltip")

var onMouseEnter = function(d) {

  
  
    tooltip.
      select("#pages")
          .html( `
            Week Number:  ${d.week_diff}<br>
            Honour Level: ${d.honour}<br>
            Wikipedia pages created: ${d.n}`)

           

   
  tooltip
      .style("left", (d3.mouse(this)[0] + 90) + "px") 
      .style("top", (d3.mouse(this)[1])+ "px")

        tooltip.style("opacity", 1)

        

}

function onMouseLeave() {
    tooltip.style("opacity", 0)
  }



  

svg.selectAll()
      .data(dataset, function(d) {return d.honour+':'+d.week_diff;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return xScale(d.week_diff) })
      .attr("y", function(d) { return yScale(d.honour) })
      .attr("width", xScale.bandwidth() )
      .attr("height", yScale.bandwidth() )
      .style("fill", function(d) { return myColor(d.n)} )
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)


//legend

}

drawHeatmap()