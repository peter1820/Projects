function getPM() {
 	var listItems= "<option value=''>Select :</option>";
    $.getJSON('mocks/projectsData.json', function(data) {
    	for (var i = 0; i < data.length; i++) {
        	listItems += "<option value='" + data[i].name + "'>" + data[i].name + "</option>";
    	}
    	$("#PMname").html(listItems);
		localStorage.setItem('projects', JSON.stringify(data));
    }); 
}

function printAll() {
	var i  = 0; 
	var projects = JSON.parse(localStorage.getItem('projects'));
	var projectName = document.getElementById("PMname").value;
	for (i = 0; i < projects.length; i += 1) {
		if (projectName === projects[i].name) {
			printPM(projects[i].PM);
			printChart(projects[i].DEV, "DEV");
			printChart(projects[i].QA, "QA");
		}
	}
}