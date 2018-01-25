var statData = [
	{
		Year: '2013',
		Births: 58719,
		Deaths: 29568,
		Marriages: 19237
	},
	{
		Year: '2014',
		Births: 57243,
		Deaths: 31062,
		Marriages: 20125
	},
	{
		Year: '2015',
		Births: 61038,
		Deaths: 31608,
		Marriages: 19947
	},
	{
		Year: '2016',
		Births: 59430,
		Deaths: 31179,
		Marriages: 20235
	},
	{
		Year: '2017',
		Births: 58450,
		Deaths: 31989,
		Marriages: 14234
	}
];

//Load chart packages
google.charts.load('current', { packages: ['corechart'] });

//Run the function drawChart
google.charts.setOnLoadCallback(drawChart);

function drawChart(){
	
	// Manually adding data
	
	// var data = google.visualization.arrayToDataTable([
	// 	['Year', 'Births', 'Deaths', 'Marriages'],
	// 	['2013', 58719, 29568, 19237],
	// 	['2014', 57243, 31062, 20125],
	// 	['2015', 61038, 31608, 19947],
	// 	['2016', 59430, 31179, 20235]
	// ]);

	var data = new google.visualization.DataTable();
	//Adding Columns
	data.addColumn('string', 'Year',);
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
		hAxis:{
			title:'Number',
			minValue: 0,
		},
		vAxis:{
			title: 'Year'
		},
		animation:{
			startup: true,
			duration: 1000,
			easing: 'out'
		}
	};

	//Creating a new chart, 'new' visualsation. draw chart in specified ID.
	var chart = new google.visualization.BarChart(document.getElementById('chartLocation'));

	// invoke  draw graph
	chart.draw(data, options);
}