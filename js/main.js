$( document ).ready(function(){

	$.when( $.getJSON('../data/mfarm_60_days.json') )
	.done(
		function(data){
			var products = checkUniques(data)
			$.each(products, function(i){
				$('#products').append('<option value="' + products[i] + '">' + products[i] + '</option>')
			})
		}
	)

	$('select').on('change', function(){
		$.when( $.getJSON('../data/mfarm_60_days.json') )
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