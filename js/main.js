$( document ).ready(function(){

	$.when( $.getJSON('https://gist.github.com/pdarche/5177672/raw/43e53332012706e8bc6866a141d089e142dba765/60_day_mfarm.json') )
	.done(
		function(data){
			var products = checkUniques(data)
			$.each(products, function(i){
				$('#products').append('<option value="' + products[i] + '">' + products[i] + '</option>')
			})
		}
	)

	$('select').on('change', function(){
		$.when( $.getJSON('https://gist.github.com/pdarche/5177672/raw/43e53332012706e8bc6866a141d089e142dba765/60_day_mfarm.json') )
		.done(
			function(d){
				data = []
				prices = []

				var location = $('#location :selected').val(),
					product = $('#products :selected').val()

				selectData(d, product, location)
				
				var minDate = getDate(data[0]),
				    maxDate = getDate(data[data.length-1]),
				    minPrice = Number(d3.min(prices)) - 20,
				    maxPrice = Number(d3.max(prices)) + 20

				data.sort(compare)

				setupVis( minPrice, maxPrice, minDate, maxDate )

			}
		)
	})

})