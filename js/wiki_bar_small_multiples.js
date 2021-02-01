

async function drawWikiBars () {



	const formatPerecent = d3.format(".0%")


	const dataset_bar_wiki_gender = await d3.csv("data/wiki_prop_gender.csv", function(d) { return{
		honour: d.award_label,
		total_honour: +d.total,
		total_gender: +d.gender_total,
		prop_gender: +d.prop,
		gender: d.gender

}

	})

	// console.log(dataset_bar_wiki_gender)

// 	const margin = ({top: 30, right: 0, bottom: 10, left: 30})

// 	const width = 200
// 	const height = 200


	// const data_group = d3.group(dataset_bar_wiki_gender, d )

	
	const yAccessor = Array.from(d3.extent(dataset_bar_wiki_gender, d => d.prop_gender))


  	const xAccessor = Array.from(d3.extent(dataset_bar_wiki_gender, d => d.gender))

  	
  	const honour_level = Array.from(d3.extent(dataset_bar_wiki_gender, d => d.honour))

  	const yHeight = d => d.length


  
//nesting data into groups for small charts / creating a key based on honour level 

  	const nestData = d3.nest()
  		.key(d =>  d.honour)
  		.entries(dataset_bar_wiki_gender)

  	// console.log(nestData)	

//getting key for headers  		

  	const key = nestData.map(d => d.key)


  	const margin = ({top: 30, right: 0, bottom: 10, left: 30})

	const width = 250
	const height = 250


	 const svg = d3.select(".wiki_bar_gender")
		  	.selectAll("smallChart")
		  	.data(nestData)
		  		.enter()
		  		.append("svg")
		  		.attr("width", width + margin.left + margin.right)
		  		.attr("height", height+ margin.top + margin.bottom)


			

// //scales
  	
const xScale = d3.scaleBand	()
	.domain(xAccessor)
	 .range([margin.left, width - margin.right])
	 .padding([0.2])
	


const yScale = d3.scaleLinear()
	.domain(yAccessor)
	.range([height, margin.top])
	



//Draw Axis

const xAxis = d3.axisBottom()
            .scale(xScale)
            .tickPadding(3)	
            
			
 
            svg	
            .append("g")
            .call(xAxis)
            .attr("class", "xAxis")
            .attr("transform", `translate(0,${height})`) 


const yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(4, "%")
			
	svg
          .append("g")
          .attr("class", "yAxis")
          .attr("transform", `translate(${margin.left},0)`)   
          .call(yAxis)	
           

// draw rects and labels

	svg
		.selectAll(".bar")
		.data(d => d.values)
		.enter()
		.append("rect")
		.attr("x", d => xScale(d.gender))
		.attr("y", d => yScale(d.prop_gender))
		.attr("width", xScale.bandwidth())
		.attr("height", d => height - yScale(d.prop_gender))
		.attr("class", "gender_wiki_bar")
		



    svg

      
      .append("text")
      .attr("text-anchor", "start")
      .attr("x", margin.left)
  		.attr("y", margin.top-margin.bottom)
  		.attr("class", "heading")
      .text(d => d.key)       


}

drawWikiBars()