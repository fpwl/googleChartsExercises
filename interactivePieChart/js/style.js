//Load chart packages
google.charts.load('current', { packages: ['corechart'] });
//Run the function drawChart
google.charts.setOnLoadCallback(drawChart);

function drawChart(){

	$.ajax({
		url: 'js/movieInfo.json',
		dataType: 'json',
		success: function (dataFromServer){
			var data =  new google.visualization.DataTable();
			data.addColumn('string', 'Movie Title');
			data.addColumn('number', 'Domestic Net Income');

			for (var i= 0; i < dataFromServer.length; i++){
				data.addRow([dataFromServer[i].movie_title, dataFromServer[i].domestic_net_income]);
			}

			var option = {
				title: 'Domestic Net Income of Movies',
				// is3D: true,
				slices: {
					0: { color: '#0044ff' },
					1: { color: '#1855da' },
					2: { color: '#1c64ff' },
					3: { color: '#1886da' },
					4: { color: '#41b0ff' },
				}
			}

			var chart = new google.visualization.PieChart(document.getElementById('chartLocation'));
			//adding google click event
			google.visualization.events.addListener(chart, 'select', clickEvent);
			chart.draw(data, option);

			function clickEvent() {
				var tableRow = chart.getSelection()[0].row;
				var personData = dataFromServer[tableRow];

				if (personData){
					document.getElementById('movieTitle').innerText = personData.movie_title;
					document.getElementById('genre').innerText = personData.movie_genre;
					document.getElementById('views').innerText = personData.views;
					document.getElementById('internationalNetIncome').innerText = personData.international_net_income;
					document.getElementById('domesticNetIncome').innerText = personData.domestic_net_income;
					document.getElementById('awards').innerText = personData.awards;
					document.getElementById('language').innerText = personData.Language;
				}
			}
		},

		error: function (errorFromServer) {
			console.log(errorFromServer);
			alert('Something went wrong, cannot connect to server');
		}
	});
}