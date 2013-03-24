
var w = 900,
    h = 400,
    p = 20

var vis = d3.select("#vis_container")
	.append("svg:svg")
	.attr("width", w + p * 2)
	.attr("height", h + p * 2)
  	.append("svg:g")
	.attr("transform", "translate(" + p + "," + p + ")")


function updateVis( minPrice, maxPrice, minDate, maxDate, data ){

	var y = d3.scale.linear().domain([minPrice, maxPrice]).range([ h, 0 ]),
    	x = d3.time.scale().domain([minDate, maxDate]).range([ (3 * p), w - (2 * p) ]),
    	yAxis = d3.svg.axis().scale(y).orient("left").ticks(10).tickSize(1)

    console.log(data)

    //x ticks
    var rules = vis.selectAll("g.date")
		.data(x.ticks(10), function(d){ return d })

	var rulesEnter = rules.enter().append('svg:g')
		.attr("class", "date")
		.attr("transform", function(d) { return "translate(" + x(d) + ",0)"; })

    rulesEnter.append("svg:text")
	    .attr("y", h + 3)
	    .attr("dy", ".71em")
	    .attr("text-anchor", "middle")
	    .text(x.tickFormat(10))

    rules.exit().remove();

    //yticks
    d3.selectAll('.y.axis')
    	.attr('x', -50)
    	.transition(500)
    	.style("fill-opacity", 0)
    	.remove()

	vis.append("svg:g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + p + ",0)")
		.style('fill-opacity', 0)
		.call(yAxis)
		.transition(500)
		.style('fill-opacity', 1)
	

	//gridlines 
  	var grays = vis.selectAll(".gray-line")
	     .data(y.ticks(10), function(d) { return d })
	   
	grays.enter().insert("line")
	     .attr("x1", (2 * p) )
	     .attr("x2", w)
	     .attr("y1", y)
	     .attr("y2", y)
	     .attr("class", "gray-line")
	     .style("stroke", "#ccc")

	grays.exit()
		.transition()
			.duration(500)
			.style('fill-opacity', 0)
			.remove()

    d3.selectAll('path.line')
    	.transition()
    		.duration(500)
    		.attr("d", d3.svg.line()
		      	  .interpolate("cardinal")
		          .x(function(d) { return x(getDate(d)) })
		          .y(function(d) { return y(d.y) })
		     )
	    	.style("fill-opacity", 0)
	    	.remove()

    var path = vis.append("g").selectAll("path.line")
    	.data([data])

    path.enter().append("svg:path")
      .attr("class", "line")
      .attr("d", d3.svg.line().x(0).y(0) )
      .transition()
	      .attr("d", d3.svg.line()
	      	  .interpolate("cardinal")
	          .x(function(d) { return x(getDate(d)) })
	          .y(function(d) { return y(d.y) })
	      )

    var circles = vis.selectAll(".price")
	    	.data(data, function(d){ return d })

	circles.enter().append("svg:circle")
	    .attr("class", "price")
	    .attr("fill", "none")
	    .attr("stroke", "black")
	   	.transition()
	        .duration(500)
		    .attr("cx", function(d) { return x(getDate(d)) })
		    .attr("cy", function(d) { return y(d.y); })
		    .attr("r", 4)

    circles.exit()
    	.transition()
    		.duration(500)
	    	.attr("cx", function(d) { return x(getDate(d)) })
			.attr("cy", function(d) { return y(d.y); })
    	.remove();

    vis.on("click", function() {
    	console.log("click")
    	var t = vis.transition().duration(750);
    	t.select(".y.axis").call(yAxis);
    })

}

// d3.json('https://gist.github.com/pdarche/5177672/raw/43e53332012706e8bc6866a141d089e142dba765/60_day_mfarm.json', function(d){

// 	selectData(d, "Wheat", "NAIROBI")

// 	checkUniques(d)
	
// 	var minDate = getDate(data[0]),
// 	    maxDate = getDate(data[data.length-1]),
// 	    minPrice = Number(d3.min(prices)) - 20,
// 	    maxPrice = Number(d3.max(prices)) + 20

// 	data.sort(compare)

// 	var w = 900,
// 	    h = 400,
// 	    p = 60,
// 	    y = d3.scale.linear().domain([minPrice, maxPrice]).range([h, 0]),
// 	    x = d3.time.scale().domain([minDate, maxDate]).range([0, w - 300]);

//     var vis = d3.select("#vis_container")
// 		.data([data])
// 	  .append("svg:svg")
// 		.attr("width", w + p * 2)
// 		.attr("height", h + p * 2)
// 	  .append("svg:g")
// 		.attr("transform", "translate(" + p + "," + p + ")")

// 	console.log("the vis ", vis)

//     var rules = vis.selectAll("g.rule")
// 		  .data(x.ticks(10))
// 		.enter().append("svg:g")
// 		  .attr("class", "rule")

// 	console.log("the rules ", rules)

// 	var yAxis = d3.svg.axis()
// 	      .scale(y)
// 	      .orient("left")
// 	      .ticks(10)
// 	      .tickSize(1)

//   	vis.selectAll("range")
// 	     .data(y.ticks(10))
// 	   .enter().insert("line", "#growth")
// 	     .attr("x1", 0)
// 	     .attr("x2", w)
// 	     .attr("y1", y)
// 	     .attr("y2", y)
// 	     .attr("class", "gray-line")
// 	     .style("stroke", "#ccc")

// 	vis.insert("g", "#growth")
// 		 .attr("class", "axis y-axis")
// 		 .style('stroke-width', '1px')
// 		 .call(yAxis)

//     rules.append("svg:text")
// 	    .attr("x", x)
// 	    .attr("y", h + 3)
// 	    .attr("dy", ".71em")
// 	    .attr("text-anchor", "middle")
// 	    .text(x.tickFormat(10))

//     rules.append("svg:text")
// 	    .attr("y", y)
// 	    .attr("x", -5)
// 	    .attr("dy", ".35em")
// 	    .attr("text-anchor", "end")
// 	    .text(y.tickFormat(10))

//     vis.append("svg:path")
// 	    .attr("class", "line")
// 	    .transition()
// 	    .attr("d", d3.svg.line()
// 	    	.interpolate("basis")
// 	        .x(function(d) { return x(getDate(d)) })
// 	        .y(function(d) { return y(d.y) })
// 	    )

//     var circles = vis.selectAll("circle.line")
// 	    .data(data)
// 	  .enter().append("svg:circle")
// 	    .attr("class", "price")
// 	    .attr("fill", "none")
// 	    .attr("stroke", "black")
// 	    .attr("cx", function(d) { return x(getDate(d)) })
// 	    .attr("cy", function(d) { return y(d.y); })
// 	    .attr("r", 5)
// 	    .on('mouseover', function(){
// 	    	d3.select(this).attr('fill', 'black')
// 	    })

// 	// circles.exit().remove()

// })


