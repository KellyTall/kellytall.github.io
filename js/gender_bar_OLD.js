async function drawBars () {


//set dimensions

const margin = ({top: 20, right: 30, bottom: 30, left: 40})

const width = 900
const height = 500


//import data


const date_parse = d3.timeParse("%Y")


//import and set up data



const dataset_bar = await d3.csv("data/gender_bar.csv", function(d) { return {
	date: +d.honours_year, 
	key: d.gender, 
	value: +d.number,

}
})


keys = Array.from(d3.group(dataset_bar, d => d.key).keys())

years = Array.from(d3.group(dataset_bar, d => d.date).keys())

values=Array.from(d3.rollup(dataset_bar, ([d]) => d.value, d => +d.date, d => d.key))

group = Array.from(d3.group(dataset_bar, d => +d.date, d => d.key))



//stack data - gets the height of each of the keys stacked on top of one and other based on the values of the data

stacked_data = d3.stack()
    .keys(keys)
    .value(([, values], key) => values.get(key))
  (values)


//create scales

const xScale = d3.scaleBand()
	.domain(years)
	.range([0, width - margin.right])
	.padding([0.2])


const yScale = d3.scaleLinear()
	.domain([0, d3.max(stacked_data, d => d3.max(d, d => d[1]))]).nice()
	.range([height - margin.bottom, 0])




const color_scale = d3.scaleOrdinal()
        .domain(keys)
        .range(['#214151','#f8dc81'])






}

drawBars()