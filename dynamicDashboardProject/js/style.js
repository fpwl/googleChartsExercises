//Load chart packages and controls
google.charts.load('current', { 'packages': ['corechart', 'controls']});
//Run the function drawDashboard
google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard(){

	$.ajax({
		url: 'js/peopleInfo.json',
		dataType: 'json',
		success: function (dataFromJSON) {
			var data = new google.visualization.DataTable();

			data.addColumn('string', 'Name');
            data.addColumn('number', 'Age');
            data.addColumn('number', 'Income');
            data.addColumn('string', 'Gender');
			data.addColumn('string', 'Country');

			for (var i = 0; i < dataFromJSON.length; i++) {
				data.addRow([
					dataFromJSON[i].first_name + ' ' + dataFromJSON[i].last_name,
					dataFromJSON[i].age,
					dataFromJSON[i].annual_income,
					dataFromJSON[i].gender,
					dataFromJSON[i].country
				]);
			};
			var dashboard = new google.visualization.Dashboard(
				document.getElementById('dashboard')
			);

			// adding Scatter Chart for Age and Income
			var scatterChart = new google.visualization.ChartWrapper({
				chartType: 'ScatterChart',
				containerId: 'chart1',
				options: {
					width: '100%',
					height: '100%',
					legend: 'none',
					title: 'Age vs Annual Income',
					colors: ['white'],
					backgroundColor: {
						fill: 'transparent'
					},
					hAxis: {
						title: 'Age',
						ticks: [20, 40, 60, 80, 100],
						gridlines: {
							color: '#7f8c8d'
						},
						textStyle: {
							color: 'white'
						}
					},
					vAxis: {
						title: "Annual Income",
						gridlines: {
							color: '#7f8c8d'
						},
						textStyle: {
							color: 'white'
						}
					}
				},

				view: {
					columns: [1, 2]
				},
			});

			// adding Table Chart for Gender and Income
			// var tableChart = new google.visualization.ChartWrapper({
			// 	chartType: 'Table',
			// 	containerId: 'chart2',
			// 	options: {
			// 		width: '100%',
			// 		height: '100%',
			// 	}
			// });

			// adding draggable range slider targeting Income
			var incomeRangeSlider =  new google.visualization.ControlWrapper({
				controlType: 'NumberRangeFilter',
				containerId: 'control1',

				options: {
					filterColumnLabel: 'Income',
					ui: {
						labelStacking: 'vertical'
					}
				}
			});

			// adding CatergoryFilter targeting Gender
			var genderPicker = new google.visualization.ControlWrapper({
				controlType: 'CategoryFilter',
				containerId: 'control2',

				options: {
					filterColumnLabel: 'Gender',
					ui:{
						allowMultiple: false,
						allowTyping: false,
						labelStacking: 'vertical'
					}
				}
			});

			// adding another CatergoryFilter targeting Countries
			var countryPicker = new google.visualization.ControlWrapper({
				controlType: 'CategoryFilter',
				containerId: 'control3',

				options: {
					filterColumnLabel: 'Country',
					ui: {
						allowMultiple: false,
						allowTyping: false,
						labelStacking: 'vertical'
					}
				}
			});

			//Binding all charts/dashboard/controls
			dashboard.bind([incomeRangeSlider, genderPicker, countryPicker], [scatterChart]);
			// Draw Dashboard
			dashboard.draw(data);


			// need to make another table for gender pie chart to work. Below is innvoking the function that is written below. 
			// To use the data from our JSON we must pass through the argument (dataFromJSON) because it's used above.
			drawPie(dataFromJSON);
			drawGeo(dataFromJSON);

			// PIE CHART INCOME SLIDER LINK //

			// google event listner to link with income range slider. 'statechange' because we are changing state not wanting a click event
			google.visualization.events.addListener(incomeRangeSlider, 'statechange', function () {
				// grabs the state/ info income slider
				var range = incomeRangeSlider.getState();
				// Data Veiw, taking a copy of DataTable
				var view = new google.visualization.DataView(data);
				// console.log(view);
				// asking which row we want to show. In this case row/column 2, which is income. min and max only works for numerical values
				view.setRows(data.getFilteredRows([
					{
						column: 2,
						minValue: range.lowValue,
						maxValue: range.highValue
					}
				]));
				// creating new variable by grabing the view.ol value
				var filteredRows = view.ol;
				// making and empty array to have info push into later when state is changed
				var newPieData = [];
				// looping through data in filteredRows
				for (var i = 0; i < filteredRows.length; i++) {
					// pushing filtered data to newPieData array
					newPieData.push(dataFromJSON[filteredRows[i]]);
				}

				//drawPie is to redraw the pieChart with the newPieData array data everytime the state changes. 
				drawPie(newPieData);
			});

			// // GEO CHART COUNTRIES LINK
			// google.visualization.events.addListener(countryPicker, 'statechange', function () {
			// 	var range = countryPicker.getState();
			// 	var view = new google.visualization.DataView(data);
			// 	// console.log(view);
			// 	view.setRows(data.getFilteredRows([
			// 		{
			// 			column: 4
			// 		}
			// 	]));

			// 	var filteredRows = view.ol;
			// 	var newGeoData = [];

			// 	for (var i = 0; i < filteredRows.length; i++) {
			// 		newGeoData.push(dataFromJSON[filteredRows[i]]);
			// 	}
			// 	drawGeo(newGeoData);
			// });


			
		},
		error: function (errorFromJSON) {
			console.log('Something went wrong, cannot connect to server!'); 
			console.log(errorFromJSON);
			alert('Something went wrong, cannot connect to server!');
		},
	})
};

// ADDING INTERATCTIVE PIE CHART FUNCTION//

// Making another table to take the gender data so Pie chart will function
function drawPie(data) {
	var dataGender = new google.visualization.DataTable();
	dataGender.addColumn('string', 'Gender');
	dataGender.addColumn('number', 'Count');

	var male = 0, female = 0;


	for (var i = 0; i < data.length; i++) {
		if (data[i].gender == 'Male') {
			male++;
		} else if (data[i].gender == 'Female') {
			female++;
		}
	}

	dataGender.addRow(['Male', male]);
	dataGender.addRow(['Female', female]);

	var options = {
		title: "Male and Female Split",
		backgroundColor: {
			fill: 'transparent',
			color: 'white'
		}
	};

	var Pie = new google.visualization.PieChart(document.getElementById('chart2'));
	Pie.draw(dataGender, options);
}

// ADDING INTERATCTIVE GEO CHART FUNCTION//

function drawGeo(data) {
	var dataCountries = new google.visualization.DataTable();
	dataCountries.addColumn('string', 'Countries');
	dataCountries.addColumn('number', 'Count');

	var China = 0,
		Brazil = 0, 
		Philippines = 0 ;
		UnitedStates = 0,
		Russia = 0,
		Canada = 0,
		Japan = 0,
		Mexico = 0,
		Thailand = 0,
		UnitedKingdom = 0, 
		Ireland = 0,
		SouthKorea = 0,
		SouthAfrica = 0;

	for (var i = 0; i < data.length; i++) {
		if (data[i].country == 'China') {
			China++;
		} else if (data[i].country == 'Brazil') {
			Brazil++;
		} else if (data[i].country == 'Philippines') {
			Philippines++;
		} else if (data[i].country == 'United States') {
			UnitedStates++;
		} else if (data[i].country == 'Russia') {
			Russia++;
		} else if (data[i].country == 'Canada') {
			Canada++;
		} else if (data[i].country == 'Japan') {
			Japan++;
		} else if (data[i].country == 'Mexico') {
			Mexico++;
		} else if (data[i].country == 'Thailand') {
			Thailand++;
		} else if (data[i].country == 'United Kingdom') {
			UnitedKingdom++;
		} else if (data[i].country == 'Ireland') {
			Ireland++;
		} else if (data[i].country == 'South Korea') {
			SouthKorea++;
		} else if (data[i].country == 'South Africa') {
			SouthAfrica++;
		}
	}

	dataCountries.addRow(['China', China]);
	dataCountries.addRow(['Brazil', Brazil]);
	dataCountries.addRow(['Philippines', Philippines]);
	dataCountries.addRow(['United States', UnitedStates]);
	dataCountries.addRow(['Russia', Russia]);
	dataCountries.addRow(['Canada', Canada]);
	dataCountries.addRow(['Japan', Japan]);
	dataCountries.addRow(['Mexico', Mexico]);
	dataCountries.addRow(['Thailand', Thailand]);
	dataCountries.addRow(['United Kingdom', UnitedKingdom]);
	dataCountries.addRow(['Ireland', Ireland]);
	dataCountries.addRow(['South Korea', SouthKorea]);
	dataCountries.addRow(['South Africa', SouthAfrica]);


	var options = {
		title: "Male and Female Split",
		backgroundColor: {
			fill: 'transparent',
			color: 'white'
		}
	};

	var Geo = new google.visualization.GeoChart(document.getElementById('chart3'));
	Geo.draw(dataCountries, options);
}