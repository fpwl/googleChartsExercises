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
			data.addColumn('number', 'Year', );
			data.addColumn('number', 'Births');
			data.addColumn('number', 'Deaths');
			data.addColumn('number', 'Marriages');

			//Adding Rows
			for (var i = 0; i < statData.length; i++) {
				data.addRow([statData[i].Year, statData[i].Births, statData[i].Deaths, statData[1].Marriages]);
			}

			var options = {
				title: 'Births, Deaths, and Marriages From New Zealand',
				subtitle: 'over the last 4 years',
				hAxis: {
					title: 'Number',
					minValue: 0,
				},
				vAxis: {
					title: 'Year'
				},
				animation: {
					startup: true,
					duration: 1000,
					easing: 'out'
				}
			};
			//Creating a new chart, 'new' visualsation. draw chart in specified ID.
			var chart = new google.visualization.BarChart(document.getElementById('chartLocation'));

			// invoke  draw graph
			chart.draw(data, options);
		},
		error: function () {
			alert('Something went wrong, cannot connect to server');
		}
	});
}