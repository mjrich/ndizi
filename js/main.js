$( document ).ready(function(){

	$.when( $.getJSON('https://gist.github.com/pdarche/5177672/raw/43e53332012706e8bc6866a141d089e142dba765/60_day_mfarm.json') )
	.done(
		function(d){
			var products = checkUniques(d)
			$.each(products, function(i){
				$('#products').append('<option value="' + products[i] + '">' + products[i] + '</option>')
			})
		}
	)

	$('select').on('change', function(){
		$.when( $.getJSON('https://gist.github.com/pdarche/5177672/raw/43e53332012706e8bc6866a141d089e142dba765/60_day_mfarm.json') )
		.done(
			function(d){

				var location = $('#location :selected').val(),
					product = $('#products :selected').val()

				var selected = selectData(d, product, location)

				var data = selected[0]
				var prices = selected[1]
				
				var minDate = getDate(data[0]),
				    maxDate = getDate(data[data.length-1]),
				    minPrice = Number(d3.min(prices)) - 20,
				    maxPrice = Number(d3.max(prices)) + 20

				data.sort(compare)

				updateVis( minPrice, maxPrice, minDate, maxDate, data )

			}
		)
	})

})

function selectData(d, product, location) {

	var data = [],
		prices = []

	for (date in d ){
		$.each(d[date], function(obj){
			
			if ( this.produce === product
				&& this.location == location ){
				prices.push(this.high)
				data.push( { "x" : date, "y" : this.high } )
			}

		})
	}

	return [ data, prices ]
}

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

