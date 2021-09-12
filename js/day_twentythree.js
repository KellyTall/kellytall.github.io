async function drop_down() {


    // bring in data

    const data = await d3.json("./../data/scatter.json")

    // console.log(data)

    // set dimensions

    const width = 700
    const height = 620
    const margin = { top: 60, right: 90, bottom: 40, left: 80 }

    // select the svg

    const svg = d3.select(".scatter")
        .append("svg")
        .attr("viewBox", "0 0 700 620")
        .attr('transform', `translate(${margin.left},${margin.bottom})`)


    const axisGroupX = svg
        .append('g')
        .attr('class', 'axisX')
        .attr('transform', `translate(0,${height - margin.top})`)



    const axisGroupY = svg
        .append('g')
        .attr('class', 'axisY')
        .attr('transform', `translate(${margin.left},0)`)



    const axisXText = svg
        .append("text")
        .attr("class", "axisX_text")
        .attr("transform", `translate(${width/2}, ${height-(margin.bottom/4)})`)
        .text("x axis")


    const axisYText = svg
        .append("text")
        .attr("class", "axisY_text")
        .attr("transform", `translate(${margin.right/4}, ${height/2}) rotate(-90)`)
        .text("y axis")



    const placeCities = function() {

        let inputX = document.querySelector("select[name=valueX]")
        let inputY = document.querySelector("select[name=valueY]")

        let valueX = inputX.value
        let valueY = inputY.value

        let textX = inputX.options[inputX.selectedIndex].innerHTML
        let textY = inputY.options[inputY.selectedIndex].innerHTML

        axisXText.text(textX)
        axisYText.text(textY)

        // calculating max values of variables

        let maxValueX = d3.max(data, d => d[valueX])
        let maxValueY = d3.max(data, d => d[valueY])
        let maxValueR = d3.max(data, d => d.population)



        // scaling based on max values of varaibles  

        const scaleX = d3.scaleLinear()
            .domain([0, maxValueX])
            .range([margin.left, width - margin.right])


        const scaleY = d3.scaleLinear()
            .domain([0, maxValueY])
            .range([height - margin.top, margin.top])

        const scaleR = d3.scaleSqrt()
            .domain([0, maxValueR])
            .range([0, 20])


        // axis

        const axisX = d3.axisBottom(scaleX)
            .tickSizeInner(margin.top - height + margin.top)
            .tickSizeOuter(5)
            .tickPadding(10)
            .ticks(10, ("$,f"))





        const axisY = d3.axisLeft(scaleY)
            .tickSizeInner(margin.left - width + margin.right)
            .tickSizeOuter(5)
            .tickPadding(10)
            .ticks(10)
            .ticks(10, ("$,f"))




        axisGroupX
            .call(axisX)




        axisGroupY
            .call(axisY)



        // places points in SVG    


        const cities = svg
            .selectAll("g.city")
            .data(data, d => d.city) //indexes data so "raise" (see below) works
            .enter()
            .append('g')
            .attr("class", "city")
            .attr("transform", (d, i) => {
                const x = scaleX(d[valueX])
                const y = scaleY(d[valueY])
                return `translate(${x},${y})`

            })

        // transitions in circles

        cities
            .append('circle')
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 0)
            .transition()
            .attr("r", d => scaleR(d.population))
            .attr("class", "scatter_circle")

        cities
            .append('rect')
            .attr('x', -60)
            .attr('y', d => 1 - scaleR(d.population) - 35)
            .attr('width', 120)
            .attr('height', 30)

        cities
            .append('text')
            .attr('x', 0)
            .attr('y', d => 10 - scaleR(d.population) - 25)
            .text(d => d.city)



        // transitions circles as they move

        svg
            .selectAll("g.city")
            .transition()
            .duration(500)
            .attr("transform", (d, i) => {
                const x = scaleX(d[valueX])
                const y = scaleY(d[valueY])
                return `translate(${x},${y})`

            })

        // this raises up as we hover over, but this only works when data is indexed when 
        // the data is first called in

        svg
            .selectAll("g.city")
            .on("mouseover", function() {
                d3.select(this).raise()

            })



    }

    placeCities()



    const selectTags = document.querySelectorAll("select")


    selectTags.forEach((selectTag) => {
        selectTag.addEventListener("change", function() {

            placeCities()
        })

    })




}

drop_down()