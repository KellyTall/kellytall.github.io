

async function drawBars () {


const dateTime = d3.timeParse("%m/%d/%Y %H:%M:%S %p")

const dataset = await d3.csv('data/wikipedia_edits_timeline.csv', function(d) { return {

	date: dateTime(d.date_time),
	country: d.country,
	annotation: d.annotation,
	pos: +d.pos,
	time: d.time

}
})

const date_range = d3.extent(dataset, d => d.date)

const color_key = Array.from(d3.group(dataset, d => d.country).keys())

  
  console.log(dataset)

  const wrapper = d3.select(".time_one")
		.append("svg")
		.attr("viewBox", "0 0 1000 900")

let dimensions = {
		width: 1000,
		height: 900,
		margin: {
				top: 120,
				right: 20,
				bottom: 40,
				left: 80,},
		}


dimensions.boundedWidth = dimensions.width
     - dimensions.margin.left
     - dimensions.margin.right
   dimensions.boundedHeight = dimensions.height
     - dimensions.margin.top
     - dimensions.margin.bottom



const bounds = wrapper.append("g")
				.style("transform", `translate(${
					dimensions.margin.left
					}px, ${
						dimensions.margin.top
					}px)`)

const x = d3.scaleTime()
  		.domain(date_range)
  		.range([0, dimensions.boundedWidth])		


const  y = d3.scaleLinear()
		.domain([0, 1])
		.range([dimensions.boundedHeight/2, 0])
		


const color = d3.scaleOrdinal()
  		.domain(color_key)
  		.range(["#eb5e0b", "#5eaaa8"])


const xAxis = d3.axisBottom()
	.scale(x)


// const yAxis = d3.axisLeft()
// 	.scale(y)




var annotations = [

	{
    type:d3.annotationXYThreshold,
    note: {	
  	  title: "16:00 Mubarak Resigns",
  	  align: "middle",
  	  lineType:"horizontal",
  	  wrap: 100,
  	  padding: 2
    },
    data: {date: "2/11/2011 3:55:00 PM" , pos: 0},
    dy:-360,
    dx:0,
	   

},

{
    type:d3.annotationLabel,
    note: {	
  	  title: "February 12 2011",
  	  align: "middle",
  	  lineType:"horizontal",
  	  wrap: 100,
  	  padding: 2
    },
    data: {date: "2/12/2011 0:00:01 AM" , pos: 0},
    dy:-360,
    dx:0,
	    
},

{
    type:d3.annotationLabel,
    note: {	
    	title:"16:04 (Article)",
  	  label: "Lihaas makes update to reflect Mubarak's resignation in body of the article",
  	  align: "left",
  	  lineType:"horizontal",
  	  wrap: 200,
  	  padding: 2
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },


    data: {date: "2/11/2011 4:10:00 PM" , pos: 0},
    
    dy:-280,
    dx:0,
    
   

},

{
    type:d3.annotationLabel,
    note: {	
    	title:"17:31 (Talk)",
  	  label: "J4V4 initiates move discussion",
  	  align: "left",
  	  lineType:"horizontal",
  	  padding: 2,
  	  wrap: 90,
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },

    data: {date: "2/11/2011 5:31:00 PM" , pos: 0},
    dy:-220,
    dx:0,
    

},


	{
    type:d3.annotationLabel,
    note: {	
    	title:"18:44 (Article)",
  	  	label: "Nev1 protects page (now only accessible by auto-confirmed users) because of 'persistent vandalism'",
  		align: "left",
  	  	lineType:"horizontal",
  	  	padding: 2
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/11/2011 6:44:00 PM" , pos: 0},
    dy:-100,
    dx:0

},




{
    type:d3.annotationLabel,
    note: {	
    	title:"20:15 (Article)",
  	  label: "Tariqabjotu moves page to Egyptian revolution",
  	 
  	  align: "left",
  	  	lineType:"horizontal",
  	  	padding: 2
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/11/2011 8:15:00 PM" , pos: 0},
    dy:-20,
    dx:10,
    
    },



{
    type:d3.annotationLabel,
    note: {	
    	title:"01:08 (Article)",
  	  label: "Lihaas stops opposing changes and makes his last edit",
  	   align: "left",
  	  	lineType:"horizontal",
  	  	padding: 2
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/12/2011 1:08:00 AM" , pos: 0},
    dy:-100,
    dx:0,


},

{
    type:d3.annotationLabel,
    note: {	
    	title:"21:41 (Talk)",
  	  label: "Labattblueboy announces that the result of the move request was a move by Tariqabjotou",
  	   align: "right",
  	  	lineType:"horizontal",
  	  	padding: 2
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/12/2011 9:41:00 PM" , pos: 0},
    dy:-100,
    dx:0,
    

},


{
    type:d3.annotationLabel,
    note: {	
    	title:"17:55 (Article)",
  	  label: "The Egyptian Liberal moves Tunisian protests to revolution (but is reverted)",
  	  align: "left",
  	  	lineType:"horizontal",
  	  	padding: 5
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/11/2011 5:55:00 PM" , pos: 0},
    dy:100,
    dx:0,


},


{
    type:d3.annotationLabel,
    note: {	
    	title:"22:54 (Article)",
  	  label: "Knowledgekid8 moves Tunisian protests to revolution",
  	  align: "left",
  	  	lineType:"horizontal",
  	  	padding: 5
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/11/2011 10:54:00 PM" , pos: 0},
    dy:100,
    dx:0,

 },   

    {
    type:d3.annotationLabel,
    note: {	
    	title:"15:57 (Talk)",
  	  label: "Lihaas stops editing the article",
  	  align: "right",
  	  	lineType:"horizontal",
  	  	padding: 5
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/12/2011 3:57:00 PM" , pos: 0},
    dy:100,
    dx:0,
    

},

 {
    type:d3.annotationLabel,
    note: {	
    	title:"22:31 (Talk)",
  	  label: "Knowledgekid87 announces the result of page move discussion to revolution",
  	  align: "right",
  	  	lineType:"horizontal",
  	  	padding: 5
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/12/2011 10:31:00 PM" , pos: 0},
    dy:100,
    dx:0,


}



]



bounds
	.append("text")
	.attr("x", (0))	
	.attr("y", 0 - (dimensions.margin.top /2))
	.attr("text-anchor", "right")
	.attr("class", "chart_heading")
	.text("Timeline of changes to Wikipedia Over 48 Hours: Feb 11 and 12, 2011")	


bounds
	.append('g')
    .attr("transform", `translate(0,${dimensions.boundedHeight-dimensions.boundedHeight/2})`)
    .call(xAxis)
    .attr("class", "axis")


var makeAnnotations = d3.annotation()
				// .editMode(true)
                .notePadding(15)
                .accessors({ x: d => x(dateTime(d.date)), 
        					y: d => y(d.pos)
        })
                .annotations(annotations)

bounds 
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)        
    



// bounds
// 	.append('g')
//     // .attr("transform", `translate(0,${dimensions.boundedHeight-dimensions.boundedHeight/2})`)
//     .call(yAxis);



  // bounds
  // 	.selectAll("mycircle")
  //   .data(dataset)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", d => x(d.date))
  //   .attr("cy",  d => y(d.pos))
  //   .attr("r", "10")
  //   .attr("fill", d => color(d.country))

  }

  drawBars()