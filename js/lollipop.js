async function drawLollipop () {
	
	let dataset_lolli = await d3.csv("data/time_series_diff_full.csv", function (d){return{

			week_diff: +d.week_diff,
 			n: +d.n,
 			// honour: d.award_label

	}}
)

console.log(dataset_lolli)

var margin = {top: 10, right: 30, bottom: 90, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


    var svg = d3.select(".lollipop_wrapper")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


const weeks = Array.from(d3.group(dataset_lolli, d => d.week_diff).keys()).sort(d3.ascending)	
const pages = Array.from(d3.max(dataset_lolli, d => d.n))	

console.log(weeks)

const xScale = d3.scaleBand()
	.domain(weeks)
	.range([0, width])
	.paddingInner(0.3)
    .paddingOuter(0.4)
    .align(0.5)
    

const xAxis = d3.axisBottom()
	.scale(xScale)
	.tickValues([-500, 0, 500, 1000])
	
	


svg
	.append('g')
	.call(xAxis)	
	.attr("transform", "translate(0," + height + ")")


const yScale = d3.scaleLinear()
	.domain([0, (d3.max(dataset_lolli, d => d.n))])
  	.range([ height, 0]);	

 const yAxis = d3.axisLeft()
 	.scale(yScale) 	

  
svg.append("g")
  .call(yAxis)


svg.selectAll("myline")
  .data(dataset_lolli)
  .enter()
  .append("line")
    .attr("x1", function(d) { return xScale(d.week_diff); })
    .attr("x2", function(d) { return xScale(d.week_diff); })
    .attr("y1", function(d) { return yScale(d.n); })
    .attr("y2", yScale(0))
    .attr("stroke", "grey")


svg.selectAll("mycircle")
  .data(dataset_lolli)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return xScale(d.week_diff); })
    .attr("cy", function(d) { return yScale(d.n); })
    .attr("r", "4")
    .attr("class", "lollipop_circle")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")



}
drawLollipop()