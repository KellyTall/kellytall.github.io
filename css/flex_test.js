// const levels = [
// 	{honour: 'KD',count: 1},
// 	{honour: 'AC',count: 2 },
// 	{honour: 'AO',count: 7},
// 	{honour: 'AM',count: 27},
//   {honour: 'OAM',count: 63}
// ]

const data = [
	{ name: 'Matt', state: 'NY' },
	{ name: 'Ilia', state: 'NY' },
	{ name: 'Jan', state: 'NY' },
	{ name: 'Caitlyn', state: 'NY' },
	{ name: 'Russell', state: 'MA' },
	{ name: 'Amber', state: 'WA' }
]

const nest = d.nest()
.key((d,i) => {return d.honour})
.entries(data)

// console.log(nest)


const waffle = d3.select(."waffle")

waffle
	.selectAll ('.block')
	.data(levels)
	.enter()
	.append()
	.attr('class', 'block')