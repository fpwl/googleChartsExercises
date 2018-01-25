//Load chart packages
google.charts.load('current', { packages: ['corechart'] });
//Run the function drawChart
google.charts.setOnLoadCallback(drawChart);

function drawChart(){

	$.ajax({
		url: 'js/peopleInfo.json',
		dataType: 'json',
		success: function (dataFromServer){
			var data =  new google.visualization.DataTable();
			data.addColumn('number', 'Age');
			data.addColumn('number', 'Income');

			for (var i= 0; i < dataFromServer.length; i++){
				data.addRow([dataFromServer[i].age, dataFromServer[i].annual_income]);
			}

			var option = {
				legend: 'none', 

				chart: {
					title: "Age vs Annual Income"
				},
				hAxis: {
					title: 'Age',
					ticks: [20, 40, 60, 80, 100],
				},
				vAxis: {
					title: 'Annual Income',
					ticks: [25000, 50000, 75000, 100000 ]
				}
			}

			var chart = new google.visualization.ScatterChart(document.getElementById('chartLocation'));
			//adding google click event
			google.visualization.events.addListener(chart, 'select', clickEvent);
			chart.draw(data, option);

			function clickEvent() {
				var tableRow = chart.getSelection()[0].row;
				chart.setSelection();
				var personData = dataFromServer[tableRow];

				if (personData){
					document.getElementById('name').innerText = personData.first_name + " " + personData.last_name;
					document.getElementById('avatar').src = personData.avatar;
					document.getElementById('avatar').alt = 'Image of ' + personData.first_name;
					document.getElementById('email').innerText = personData.email;
					document.getElementById('company').innerText = personData.company;
					document.getElementById('jobTitle').innerText = personData.jobTitle;
					document.getElementById('age').innerText = personData.age;
					document.getElementById('gender').innerText = personData.gender;
				}
			}
			

		},

		error: function (errorFromServer) {
			console.log(errorFromServer);
			alert('Something went wrong, cannot connect to server');
		}
	});
}