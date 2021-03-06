

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

  const wrapper = d3.select(".new_new_version")
		.append("svg")
		.attr("viewBox", "0 0 768 1024")

let dimensions = {
		width: 768,
		height: 1024,
		margin: {
				top: 80,
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
		.domain([0, 5])
		.range([dimensions.boundedHeight, 0])
		


const color = d3.scaleOrdinal()
  		.domain(color_key)
  		.range(["#eb5e0b", "#5eaaa8"])


const xAxis = d3.axisBottom()
	.scale(x)
	.tickSize(dimensions.boundedHeight - dimensions.margin.left - dimensions.margin.right)


// const yAxis = d3.axisLeft()
// 	.scale(y)




var annotations = [

	{
    type:d3.annotationXYThreshold,
    data: {date: "2/11/2011 3:55:00 PM" , pos: 2.5},
    subject: {
    	 x1: 0,
         x2: dimensions.boundedWidth,
         

    },
    className: "reference_line",
	   

},

{
      type:d3.annotationXYThreshold,
      data: {date: "2/12/2011 0:00:01 AM" , pos: 0},
      subject: {
         y1: 10,
         y2: 725  
      },
      className: "date_event",
       

  },


	{
	note: {	
  	  title: "February 11",
  	  align: "right",
  	  lineType:"none",
  	  orientation:"bottom",
  	  wrap: 100,
  	  padding: 3

    },
    type:d3.annotationXYThreshold,
    data: {date: "2/11/2011 2:00:00 PM" , pos: 5},
    subject: {
    	 x1: 0,
         x2: 195,
         

    },
    className: "day_line",
	   

},



{
    
note: {	
  	  title: "February 12",
  	  align: "left",
  	  lineType:"none",
  	  orientation:"bottom",
  	  wrap: 100,
  	  padding: 3

    },
    type:d3.annotationXYThreshold,
    data: {date: "2/12/2011 12:00:00 AM" , pos: 5},
    nx: 5,
    
    subject: {
    	 x1: 200,
      x2: dimensions.boundedWidth,
         

    },
    disable: "connector",
    className: "day_line",
	   

},


	{
    type:d3.annotationXYThreshold,
    note: {
  	  title: "16:00 Mubarak Resigns",
  	  align: "left",
  	  lineType:"none",
  	  orientation:"top",
  	  wrap: 400,
  	  padding: 2

    },
    nx: -10,
    data: {date: "2/11/2011 4:00:00 PM" , pos: 0},
     subject: {
    	 y1: 60,
         y2: 725	 

    },
    className: "resign",
    disable: "connector"
	   

},

	


{
    type:d3.annotationLabel,
    note: {	
    	title:"16:04 ",
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


    data: {date: "2/11/2011 4:04:00 PM" , pos: 2.5},
    
    dy:-310,
    dx:0,
    
   className: "egypt",

},

{
    type:d3.annotationLabel,
    note: {	
    	title:"17:31 ",
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

    data: {date: "2/11/2011 5:31:00 PM" , pos: 2.5},
    dy:50,
    dx:0,
    className: "egypt",
    

},


	{
    type:d3.annotationLabel,
    note: {	
    	title:"18:44 ",
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
    data: {date: "2/11/2011 6:44:00 PM" , pos: 2.5},
    dy:-120,
    dx:0,
    className: "egypt",

},

{
    type:d3.annotationLabel,
    note: { 
      title:"22:54 ",
      label: "Knowledgekid87 moves Tunisian uprising to revolution",
      align: "left",
        lineType:"horizontal",
        padding: 2,
        wrap: 200,
    },
    connector: {
      end: "dot",
      type: "line",
      endScale: 10
    },
    data: {date: "2/11/2011 10:54:00 PM" , pos: 2.5},
    dy:-150,
    dx:60,
    className: "tunisia",

 },   



{
    type:d3.annotationLabel,
    note: {	
    	title:"20:15 ",
  	  label: "Tariqabjotu moves page to Egyptian revolution",
  	 
  	  align: "left",
  	  	lineType:"horizontal",
  	  	padding: 2,
        wrap: 100,
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/11/2011 8:15:00 PM" , pos: 2.5},
    dy:-30,
    dx:0,
    className: "egypt",
    
    },


{
    type:d3.annotationLabel,
    note: {	
    	title:"01:08 ",
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
    data: {date: "2/12/2011 1:08:00 AM" , pos: 2.5},
    dy:-50,
    dx:50,
    className: "egypt",


},

{
    type:d3.annotationLabel,
    note: {	
    	title:"21:41 ",
  	  label: "Labattblueboy announces that the result of the move request was a move by Tariqabjotou",
  	   align: "right",
  	  	lineType:"horizontal",
        wrap: 250,
  	  	padding: 2
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/12/2011 9:41:00 PM" , pos: 2.5},
    dy:120,
    dx:0,
    
    className: "egypt", 

},




{
    type:d3.annotationLabel,
    note: {	
    	title:"17:55 ",
  	  label: "The Egyptian Liberal moves Tunisian uprising to revolution (but is reverted)",
  	  align: "left",
  	  	lineType:"horizontal",
  	  	padding: 2,
        wrap: 280,
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/11/2011 5:55:00 PM" , pos: 2.5},
    dy:-240,
    dx:0,

className: "tunisia",
},




    {
    type:d3.annotationLabel,
    note: {	
    	title:"15:57 ",
  	  label: "Lihaas stops editing the article",
  	  align: "right",
  	  	lineType:"horizontal",
  	  	padding: 2
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/12/2011 3:57:00 PM" , pos: 2.5},
    dy:50,
    dx:0,
    className: "tunisia",
    

},

 {
    type:d3.annotationLabel,
    note: {	
    	title:"22:31 ",
  	  label: "Knowledgekid87 announces the result of page move discussion to revolution",
  	  align: "right",
  	  	lineType:"horizontal",
  	  	padding: 2,
        wrap: 200
    },
    connector: {
    	end: "dot",
    	type: "line",
    	endScale: 10
    },
    data: {date: "2/12/2011 10:31:00 PM" , pos: 2.5},
    dy:190,
    dx:0,
    className: "tunisia",


}	



]



bounds
  .append("text")
  .attr("x", (0)) 
  .attr("y", 0 - (dimensions.margin.top /2))
  .attr("text-anchor", "right")
  .attr("class", "chart_heading")
  .text("Timeline of significant changes to English Wikipedia 48 hours after ")

bounds
  .append("text")
  .attr("x", (0)) 
  .attr("y", 20 - (dimensions.margin.top /2))
  .attr("text-anchor", "right")
  .attr("class", "chart_heading")
  .text("Hosni Mubarak's resignation on February 11, 2011")



bounds
  .append("text")
  .attr("x", 0 - 580) 
  .attr("y", 60 - (dimensions.margin.top /2))
  .attr("text-anchor", "right")
  .attr("class", "talk_heading")
  .text("Talk Page")


bounds
  .append("text")
  .attr("x", 0 - 280) 
  .attr("y", 60 - (dimensions.margin.top /2))
  .attr("text-anchor", "right")
  .attr("class", "talk_heading")
  .text("Article")





bounds
.append("circle")
.attr("cx",dimensions.boundedWidth-140)
.attr("cy",90-(dimensions.margin.top / 2))
.attr("r", 8)
.attr("class", "egypt")

bounds
.append("text")
.attr("x",dimensions.boundedWidth-125)
.attr("y",90 -(dimensions.margin.top / 2))
.text("Egyptian Wikipedia")
// .style("font-size", "15px")
.attr("alignment-baseline","middle")

bounds
.append("circle")
.attr("cx",dimensions.boundedWidth-140)
.attr("cy",115-(dimensions.margin.top / 2))
.attr("r", 8)
.attr("class", "tunisia")

bounds
.append("text")
.attr("x",dimensions.boundedWidth-125)
.attr("y",115 -(dimensions.margin.top / 2))
.text("Tunisian Wikipedia")
// .style("font-size", "15px")
.attr("alignment-baseline","middle")




// bounds
// 	.append('g')
//     .attr("transform", `translate(0,${dimensions.boundedHeight-dimensions.boundedHeight})`)
//     .call(xAxis)
//     .attr("class", "axis")


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