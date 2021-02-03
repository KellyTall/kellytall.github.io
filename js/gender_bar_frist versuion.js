
async function drawBars () {





//create date parser



// console.log(dataset_bar)


//get keys for male / female - the values that split the stack along the Y axis - creates an aray of "Women" / "Men" 



// console.log(stacked_data)





// //set dimensions of chart


const margin = ({top: 20, right: 30, bottom: 30, left: 40})

const width = 900
const height = 500


// let dimensions = {
// 		// width: window.innerWidth * 0.9,
// 		// height: 500,
// 		margin: {
// 				top: 20,
// 				right: 20,
// 				bottom: 40,
// 				left: 80,},
// 		}

// dimensions.boundedWidth = dimensions.width
//      - dimensions.margin.left
//      - dimensions.margin.right
//    dimensions.boundedHeight = dimensions.height
//      - dimensions.margin.top
//      - dimensions.margin.bottom


const svg = d3.select("#gender_bar_wrapper")
		.append("svg")
		// .attr("width", dimensions.width)
		// .attr("height", dimensions.height)

		// .attr("width", "100%")
		// .attr("height", dimensions.boundedWidth/2)
	.attr("viewBox", [0, 0, width, height])
		

// const bounds = wrapper.append("g")
// 				.style("transform", `translate(${
// 					dimensions.margin.left
// 					}px, ${
// 						dimensions.margin.top
// 					}px)`)

//creating scales



const yScale = d3.scaleLinear()
	.domain([0, d3.max(stacked_data, d => d3.max(d, d => d[1]))]).nice()
	.range([height - margin.bottom, 0])


const xScale = d3.scaleBand()
	.domain(years)
	.range([0, width - margin.right])
	.padding([0.2])


const color_scale = d3.scaleOrdinal()
        .domain(keys)
        .range(['#214151','#f8dc81'])


//generating and drawing Axis



const xAxis = d3.axisBottom()
	.scale(xScale)
	.ticks("%y")
svg
	.append("g")
	.call(xAxis)
	.style("transform", `translateY(${
		height - margin.bottom
	}px)`)
	.attr("class", "xAxis")



//call Axis




	


// const yAxisGenerator = 	d3.axisLeft()
// 	.scale(yScale)

// const yAxis = append("g")
// 	.call(yAxisGenerator)
// 	.attr("class", "yAxis")






//tooltip



// const tooltip = d3.select(".gender_tooltip")

	

// var onMouseEnter = function(d) {

// 	var subgroupName = d3.select(this.parentNode).datum().key
    
//     var subgroupYear = d.data[0]

//     var subgroupValue = d[1] - d[0]


// 	tooltip.select("#date")
// 		.text(subgroupYear)
    

// 	tooltip.select("#key")
// 		.text(subgroupName)

// 	tooltip.select("#count")
// 		.text(subgroupValue)
   
//  	tooltip
//       .style("left", (d3.mouse(this)[0]) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
//       .style("top", (d3.mouse(this)[1]-90)+ "px")

//         tooltip.style("opacity", 1)

// }


//   var onMouseLeave = function(d) {
//     tooltip
//       .style("opacity", 0)
//   }



// //draw chart



// const bars = bounds
// 		.append("g")
// 		.attr("class", "rects")
//      	.selectAll("g.rects")

//      bars	
//     	.data(stacked_data)
//     	.enter()	
//     	.append("g")
    	
// 		     .attr("fill", d => color_scale(d.key))
// 		      .selectAll("rect")
// 		      .data(d => d)
// 		      .enter()
// 		      .append("rect")
// 		        .attr("x", (d, i) => xScale(d.data[0]))
// 		        .attr("y", d => yScale(d[1]))
// 		        .attr("height", d => yScale(d[0]) - yScale(d[1]))
// 		        .attr("width", xScale.bandwidth())
// 		        .on("mouseenter", onMouseEnter)
//       			// .on("mousemove", mousemove)
//       			.on("mouseleave", onMouseLeave)
		        


}


drawBars()
