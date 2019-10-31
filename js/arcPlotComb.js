


//setting dimensions and margins of graph
var margin  = { top: 20, right: 30, bottom: 20, left:30},

		width = 1500 - margin.left - margin.right,
		height = 700 - margin.top - margin.bottom;


// append svg object to body of page

var svg1 = d3.select('#arcPlot')
	.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)	
	.append('g')
		.attr('transform',
				'translate(' + margin.left + ',' + margin.top + ')');

d3.json('https://raw.githubusercontent.com/KellyTall/Hellomister_DataBlog/master/combined.json').then (function( data) {

  // console.log(data);

	//list of node names
var allNodes = data.nodes.map(function(d) {return d.name})			

// console.log(allNodes);

var subgroups = data.links.map(function(d) {return d.group})

// console.log(subgroups);

var nest = d3
  .nest()
  .key(d => d.group)
  .entries(data.links);

console.log(nest);  



var x = d3.scaleTime()
    .domain([1770, 1880, 1970, 2000, 2010])
    .range([0, width/1.5])
    
var color = d3.scaleOrdinal()
    .domain(nest)
    // .range(['#e41a1c','#377eb8','#4daf4a'])
    .range(['#CD9C05','#3D200F' , '#319D89'])


//   // //create link joins
  var idToNode = {};
  data.nodes.forEach(function (n) {
    idToNode[n.id] = n;
  });
  

//   // Add the links
var links = svg1.selectAll('mylinks')
    .data(data.links)
    .enter()
    .append('path')
    .attr('d', function (d) {
      start = x(idToNode[d.source].name)    
      end = x(idToNode[d.target].name)      
      return ['M', start, height+220,    
        'A',                            
        (start - end)/2, ',',    
        (start - end)/2, 0, 0, ',',
        start < end ? 1 : 0, end, ',', height+220] 
        .join(' ');
    })
    .style('fill', 'none')
    .attr('stroke-opacity', 0.5)

    .attr("stroke", function(d) { return color(d.group); })
    // .attr('stroke', '#319D89')
    .attr('stroke-width', function (d){
      return d.weight/2
    });

   // Let's append a marker to split the two
            var xbar = 0;

  svg1.append("line")
              .style("stroke", "lightgrey")
              .attr("x1", xbar +2)     // x position of the first end of the line
              .attr("y1", 10)      // y position of the first end of the line
              .attr("x2", xbar + 2)     // x position of the second end of the line
              .attr("y2", 600);
  
  svg1.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", 12)
              .attr("y", 620)
              .text("1770");            
          

svg1.append("line")
              .style("stroke", "lightgrey")
              .attr("x1", xbar +90)     // x position of the first end of the line
              .attr("y1", 10)      // y position of the first end of the line
              .attr("x2", xbar + 90)     // x position of the second end of the line
              .attr("y2", 600);
  
  svg1.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", 100)
              .attr("y", 620)
              .text("1788");      






  svg1.append("line")
              .style("stroke", "lightgrey")
              .attr("x1", xbar +200)     // x position of the first end of the line
              .attr("y1", 10)      // y position of the first end of the line
              .attr("x2", xbar +200)     // x position of the second end of the line
              .attr("y2", 600);
  
  svg1.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", 205)
              .attr("y", 620)
              .text("1810");     


svg1.append("line")
              .style("stroke", "lightgrey")
              .attr("x1", xbar +995)     // x position of the first end of the line
              .attr("y1", 10)      // y position of the first end of the line
              .attr("x2", xbar +995)     // x position of the second end of the line
              .attr("y2", 600);
  
  svg1.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", 1010)
              .attr("y", 620)
              .text("1970");     

  svg1.append("line")
              .style("stroke", "lightgrey")
              .attr("x1", xbar +1080)     // x position of the first end of the line
              .attr("y1", 10)      // y position of the first end of the line
              .attr("x2", xbar +1080)     // x position of the second end of the line
              .attr("y2", 600);
  
  svg1.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", 1090)
              .attr("y", 620)
              .text("1988");                 
                 

  svg1.append("line")
              .style("stroke", "lightgrey")
              .attr("x1", xbar +1180)     // x position of the first end of the line
              .attr("y1", 10)      // y position of the first end of the line
              .attr("x2", xbar +1180)     // x position of the second end of the line
              .attr("y2", 600);
  
  svg1.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", 1189)
              .attr("y", 620)
              .text("2010");                 
   
    })
   


// text hover nodes







