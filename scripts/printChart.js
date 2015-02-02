function printChart(devArr, divId) {
	var results = [];
  var i, currChart, chartDiv, iDiv; 

	$("#" + divId).attr('class','sectiondiv');
  $('.labels').css('display', 'block');
  
  iDiv = document.getElementById(divId);
	while (iDiv.firstChild) {
		iDiv.removeChild(iDiv.firstChild);
	}	
  
  parseCsv(devArr.adr);
  results = JSON.parse(localStorage.getItem('tableData'));
  currChart = 1;
	for (i = 0; i < devArr.data.length; i++) {
    chartDiv = document.createElement('div');
		chartDiv.id = divId + i;
		chartDiv.className = 'chartDiv';
		iDiv.appendChild(chartDiv);
		switch (devArr.data[i].tip) {
			case "line":
				printLineChart(results, divId + i, currChart, devArr.data[i].name);
        currChart++;
				break;
			case "bar":		
				printBarChart(results, divId + i, currChart, devArr.data[i].name);	
        currChart++;
				break;
			case "pie":	
				printPieChart(divId + i,  devArr.data[i].name, devArr.data[i].adr);
				break;
		}
	}
}

function printLineChart(dataArray, divId, currChart, name) {
  var results = [];
	var i = 0;
	function drawChart() {
		var tableData = google.visualization.arrayToDataTable(results);
		var options = {
			title: name
		};
		var chart = new google.visualization.LineChart(document.getElementById(divId));
		chart.draw(tableData, options);
	}

   // giving the table headers
  results[0] = [];
  results[0][0] = dataArray[0][0];
  results[0][1] = dataArray[0][currChart];
  // completing the rest of the table
	for (i = 1; i < dataArray.length; i++) {
    results[i] = [];
    results[i][0] = new Date(Number(dataArray[i][0].split('.')[2]), Number(dataArray[i][0].split('.')[1]) - 1, Number(dataArray[i][0].split('.')[0]));
    results[i][1] = Number(dataArray[i][currChart]);
	}  
  
	google.load("visualization", "1", {packages:["corechart"], callback: drawChart});

  if (results[results.length - 1][1] < results[results.length - 2][1]) {
      $("#" + divId).css('box-shadow', '0 0 0 3px #E80000  , 0 0 0 5px #ddd, 0 0 0 10px #fff, 0 0 2px 10px #eee');
  }
}

function printBarChart(dataArray, divId, currChart, name) {
	var results = [];
	var i = 0;
	function drawChart() {
		var tableData = google.visualization.arrayToDataTable(results);
    var options = {
      title: name,
      vAxis: {title: 'Date',  titleTextStyle: {color: 'red'}}
    };
    var chart = new google.visualization.BarChart(document.getElementById(divId));
    chart.draw(tableData, options);
	} 
  
   // giving the table headers
  results[0] = [];
  results[0][0] = dataArray[0][0];
  results[0][1] = dataArray[0][currChart];
  // completing the rest of the table
	for (i = 1; i < dataArray.length; i++) {
    results[i] = [];
    results[i][0] = new Date(Number(dataArray[i][0].split('.')[2]), Number(dataArray[i][0].split('.')[1]) - 1, Number(dataArray[i][0].split('.')[0]));
    results[i][1] = Number(dataArray[i][currChart]);
	}
  
	google.load("visualization", "1", {packages:["corechart"], callback: drawChart});
}

function printPieChart(divId, name, address) {
	var results = [];
	var i = 0;
  var table;
	function drawChart() {
		var tableData = google.visualization.arrayToDataTable(results);
		var options = {
			title: name
		};
		var chart = new google.visualization.PieChart(document.getElementById(divId));
		chart.draw(tableData, options);
	}  
  
  // parsing the different pie csv-s
  $.ajax({
    url: address,
    async: false,
    success: function (data) {
        var i = Papa.parse(data).data;
        localStorage.setItem('pieData', JSON.stringify(i));
    }, 
    dataType: "text",
    });
    
  table = JSON.parse(localStorage.getItem('pieData'));
  // giving the table headers
  results[0] = [];
  results[0][0] = table[0][0];
  results[0][1] = table[0][1];
  // completing the rest of the table
	for(i = 1; i < table.length; i++) {
        results[i] = [];
        results[i][0] = table[i][0];
				results[i][1] = Number(table[i][1]);
	}
  
	google.load("visualization", "1", {packages:["corechart"], callback: drawChart});
}

function printPM(path) {
	var inner = '';  
  $.getJSON(path, function(data) {
		inner += '<tr><th>Project Name</th><td id="projectname"><button id="displaybutton" type="button" onclick="showDesc()">+</button>' + data[0].name + '</td></tr>';
		inner += '<tr class="tabledesc"><th>Summary</th><td>' + data[0].summary + '</td></tr>';
		inner += '<tr class="tabledesc"><th>Description</th><td>' + data[0].description + '</td></tr>';
		$("#PMtable").html(inner);
	});
}

function parseCsv(address) {
  $.ajax({
    url: address,
    async: false,
    success: function (data) {
        var i = Papa.parse(data).data;
        localStorage.setItem('tableData', JSON.stringify(i));
    }, 
    dataType: "text",
    });
}

function showDesc () {
  var elements = $(".tabledesc");
  if (elements.css('display') === 'none') {
    $('#displaybutton').text('-');
  } else {
    $('#displaybutton').text('+');
  }
  $('.tabledesc').toggle();
}