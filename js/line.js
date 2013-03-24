var data = [],
	prices = []

// helper function
function getDate(d) {
    var date = Date(d.x)
    // console.log( Date.parse(d.x).getTime()/1000 )
    return new Date(d.x);
}

function compare(a,b) {
  if (a.x < b.x)
     return -1;
  if (a.x > b.x)
    return 1;
  return 0;
}

function selectData(d, product, location) {
	for (date in d ){
		$.each(d[date], function(obj){
			
			if ( this.produce === product
				&& this.location == location ){
				prices.push(this.high)
				data.push( { x : date, y : this.high } )
			}
		})
	}
}

function checkUniques(data){

	var products = [];
	for ( key in data ) {
		for ( var i = 0; i < data[key].length; i++ ){
			var val = $.inArray(data[key][i].produce, products)

			if ( val === -1 ) {
				products.push(data[key][i].produce)
			}
		}
	}
	return products
}

function setupVis( minPrice, maxPrice, minDate, maxDate ){

	var w = 900,
	    h = 400,
	    p = 60,
	    y = d3.scale.linear().domain([minPrice, maxPrice]).range([h, 0]),
	    x = d3.time.scale().domain([minDate, maxDate]).range([0, w]);

    var vis = d3.select("#vis_container")
		.data([data])
		.append("svg:svg")
		.attr("width", w + p * 2)
		.attr("height", h + p * 2)
	.append("svg:g")
		.attr("transform", "translate(" + p + "," + p + ")")

	updateVis( vis, w, h, p, x, y )

}


function updateVis( vis, w, h, 	p, x, y ){

    var rules = vis.selectAll("g.rule")
		  .data(x.ticks(10))
		.enter().append("svg:g")
		  .attr("class", "rule")

	var yAxis = d3.svg.axis()
	      .scale(y)
	      .orient("left")
	      .ticks(10)
	      .tickSize(1)

  	vis.selectAll("range")
	     .data(y.ticks(10))
	   .enter().insert("line", "#growth")
	     .attr("x1", 0)
	     .attr("x2", w)
	     .attr("y1", y)
	     .attr("y2", y)
	     .attr("class", "gray-line")
	     .style("stroke", "#ccc")

	vis.insert("g", "#growth")
		 .attr("class", "axis y-axis")
		 .style('stroke-width', '1px')
		 .call(yAxis)

    rules.append("svg:text")
	    .attr("x", x)
	    .attr("y", h + 3)
	    .attr("dy", ".71em")
	    .attr("text-anchor", "middle")
	    .text(x.tickFormat(10))

    rules.append("svg:text")
	    .attr("y", y)
	    .attr("x", -5)
	    .attr("dy", ".35em")
	    .attr("text-anchor", "end")
	    .text(y.tickFormat(10))

    vis.append("svg:path")
	    .attr("class", "line")
	    .transition()
	    .attr("d", d3.svg.line()
	        .x(function(d) { return x(getDate(d)) })
	        .y(function(d) { return y(d.y) })
	    )

    vis.selectAll("circle.line")
	    .data(data)
	  .enter().append("svg:circle")
	    .attr("class", "price")
	    .attr("fill", "none")
	    .attr("stroke", "black")
	    .attr("cx", function(d) { return x(getDate(d)) })
	    .attr("cy", function(d) { return y(d.y); })
	    .attr("r", 5)
	    .on('mouseover', function(){
	    	d3.select(this).attr('fill', 'black')
	    })

}

d3.json('https://gist.github.com/pdarche/5177672/raw/43e53332012706e8bc6866a141d089e142dba765/60_day_mfarm.json', function(d){

	selectData(d, "Wheat", "NAIROBI")

	checkUniques(d)
	
	var minDate = getDate(data[0]),
	    maxDate = getDate(data[data.length-1]),
	    minPrice = Number(d3.min(prices)) - 20,
	    maxPrice = Number(d3.max(prices)) + 20

	data.sort(compare)

	var w = 900,
	    h = 400,
	    p = 60,
	    y = d3.scale.linear().domain([minPrice, maxPrice]).range([h, 0]),
	    x = d3.time.scale().domain([minDate, maxDate]).range([0, w - 300]);

    var vis = d3.select("#vis_container")
			.data([data])
			.append("svg:svg")
			.attr("width", w + p * 2)
			.attr("height", h + p * 2)
			.append("svg:g")
			.attr("transform", "translate(" + p + "," + p + ")")

    var rules = vis.selectAll("g.rule")
		  .data(x.ticks(10))
		.enter().append("svg:g")
		  .attr("class", "rule")

	var yAxis = d3.svg.axis()
	      .scale(y)
	      .orient("left")
	      .ticks(10)
	      .tickSize(1)

  	vis.selectAll("range")
	     .data(y.ticks(10))
	   .enter().insert("line", "#growth")
	     .attr("x1", 0)
	     .attr("x2", w)
	     .attr("y1", y)
	     .attr("y2", y)
	     .attr("class", "gray-line")
	     .style("stroke", "#ccc")

	vis.insert("g", "#growth")
		 .attr("class", "axis y-axis")
		 .style('stroke-width', '1px')
		 .call(yAxis)

    rules.append("svg:text")
	    .attr("x", x)
	    .attr("y", h + 3)
	    .attr("dy", ".71em")
	    .attr("text-anchor", "middle")
	    .text(x.tickFormat(10))

    rules.append("svg:text")
	    .attr("y", y)
	    .attr("x", -5)
	    .attr("dy", ".35em")
	    .attr("text-anchor", "end")
	    .text(y.tickFormat(10))

    vis.append("svg:path")
	    .attr("class", "line")
	    .transition()
	    .attr("d", d3.svg.line()
	        .x(function(d) { return x(getDate(d)) })
	        .y(function(d) { return y(d.y) })
	    )

    var circles = vis.selectAll("circle.line")
	    .data(data)
	  .enter().append("svg:circle")
	    .attr("class", "price")
	    .attr("fill", "none")
	    .attr("stroke", "black")
	    .attr("cx", function(d) { return x(getDate(d)) })
	    .attr("cy", function(d) { return y(d.y); })
	    .attr("r", 5)
	    .on('mouseover', function(){
	    	d3.select(this).attr('fill', 'black')
	    })

	console.log(circles)
	// circles.exit().remove()

})


