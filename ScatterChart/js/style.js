//Load chart packages
google.charts.load('current', { packages: ['corechart'] });

//Run the function drawChart
google.charts.setOnLoadCallback(drawChart);

function drawChart(){

	$.ajax({
		url: 'js/mockData.json',
		dataType: 'json',
		success: function (statData) {
			var data = new google.visualization.DataTable();

			//Adding Columns
			data.addColumn('number', 'Budget');
			data.addColumn('number', 'ActualSpending');

			//Adding Rows
			for (var i = 0; i < statData.length; i++) {
				data.addRow([statData[i].Budget, statData[i].ActualSpending]);
			}

			var options = {
				title: 'Comparison of Budget and actual spending',
				hAxis: {
					title: 'Budget',
					minValue: 0,
				},
				vAxis: {
					title: 'Actual Spending'
				},
				animation: {
					startup: true,
					duration: 1000,
					easing: 'out'
				}
			};
			//Creating a new chart, 'new' visualsation. draw chart in specified ID.
			var chart = new google.visualization.ScatterChart(document.getElementById('chartLocation'));

			// invoke  draw graph
			chart.draw(data, options);
		},
		error: function () {
			alert('Something went wrong, cannot connect to server');
		}
	});
}