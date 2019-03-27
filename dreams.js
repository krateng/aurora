var dreams = [];
var people = [];
var places = [];

var currentFilteredPerson = -1;
var currentFilteredPlace = -1;
var currentFilteredMood = -1;


var moods = [
	{name:"emotional",symbol:"😦",desc:"Highly Emotional"},	//1
	{name:"sad",symbol:"😢",desc:"Sad"},			//2
	{name:"creepy",symbol:"👻",desc:"Creepy"},		//4 👀 😨 //I am literally spending my time finding the most fitting emoji for each mood //the absolute state of my life rn
	{name:"mystery",symbol:"❓",desc:"Mysterious"},		//8
	{name:"friendship",symbol:"💛",desc:"Affectionate"},	//16
	{name:"romance",symbol:"❤️",desc:"Limerent"},		//32
	{name:"lewd",symbol:"💜",desc:"Erotic"},		//64
	{name:"joy",symbol:"😊",desc:"Joyous"},			//128
	{name:"yearning",symbol:"😩",desc:"Yearning"},		//256
	{name:"fairytale",symbol:"🌄",desc:"Romantic"},		//512 ⛰️
	{name:"serenity",symbol:"😔",desc:"Serene"}		//1024

];

function refreshPage() {

	//DREAMS

	console.log("Refreshing View, currently filtered Person " + currentFilteredPerson + ", currently filtered Place " + currentFilteredPlace);


	//sort
	var sortedDreams = sortByDate(dreams);

	//go through all the dreams
	html = ""
	for (var i=0; i<sortedDreams.length; i++) {

		if (sortedDreams[i] == undefined) continue;

		//check if we even want to see this dream according to the filters
		if (!sortedDreams[i].people.has(currentFilteredPerson) && currentFilteredPerson != -1) continue;
		if (!sortedDreams[i].places.has(currentFilteredPlace) && currentFilteredPlace != -1) continue;
		if (!hasMood(currentFilteredMood,sortedDreams[i].mood)) continue;

		//create the little icons for people
		var peopleicons = "";
		for (let item of sortedDreams[i].people) {
			var id = item;
			console.log("finding person " + id + " in database");
			//find in people database

			peopleicons += "<img class='filterbutton person' onclick='filterOnlyByPerson(" + id + ")' src='data:img/jpg;base64," + peoplepics[id] + "' title='" + people[id].name + "' onerror='this.src = \"defaultperson.jpg\";'></img>";
		}

		//create the little icons for places
		var placeicons = "";
		for (let item of sortedDreams[i].places) {
			var id = item;
			console.log("creating icon for place " + id);
			//find in places database

			placeicons += "<img class='filterbutton place' onclick='filterOnlyByPlace(" + id + ")' src='data:img/jpg;base64," + placespics[id] + "' title='" + places[id].name + "' onerror='this.src = \"defaultplace.jpg\";'></img>";
		}

		var dreamcontent = sortedDreams[i].content;
		var date = "" + twodigits(sortedDreams[i].day) + "." + twodigits(sortedDreams[i].month) + "." + sortedDreams[i].year;


		//create mood emojis
		var moodjis = ""; //end me
		num = sortedDreams[i].mood;
		id = 0;
		while (2**(id+1) <= num) {
			id++;
		}

		while (num != 0) {
			if (num >= 2**id) {
				moodjis = "<i class='moodji' title='" + moods[id].desc + "' onclick='filterByMood(" + id + ")'>" + moods[id].symbol + "</i>" + moodjis;
				num = num - (2**id);
			}

			id--;

		}


		//check if lucid
		if (sortedDreams[i].lucid) {
			classes = "lucid dream";
		}
		else {
			classes = "dream";
		}



		//create the div element for the dream entry
		html += "<div class='" + classes + "'><p class='dream_date'>" + date + "  " + moodjis + "</p><p class='dream_attributes'>" + peopleicons + "        " + placeicons + "</p><p class='dream_content'>" + dreamcontent + "</p></div>";



	}

	// add div elements
	document.getElementById("mainscreen").innerHTML = html



	// PEOPLE

	//sort array
	console.log(people);
	var sortedPeople = sortByAmount(people);
	console.log(sortedPeople);

	//go through all the people (max 15)
	html = ""
	for (var i=0; i<sortedPeople.length || i==15; i++) {
		var name = sortedPeople[i].name;
		var id = sortedPeople[i].id;
		var amount = sortedPeople[i].amount;

		//only show people who are in at least one dream
		if (amount == 0) break;

		//mark the currently filtered person
		var extraclass = "";
		if (id == currentFilteredPerson) {
			extraclass = " filtered";
		}

		html += "<li class='filterbutton" + extraclass + "' onclick='filterByPerson(" + id + ")'>" + name + " (" + amount + ")</li>";
	}
	document.getElementById("list_people").innerHTML = html



	// PLACES

	//sort array
	console.log(places);
	var sortedPlaces = sortByAmount(places);
	console.log(sortedPlaces);

	//go through all the places (max 15)
	html = ""
	for (var i=0; i<sortedPlaces.length || i==15; i++) {
		var name = sortedPlaces[i].name;
		var id = sortedPlaces[i].id;
		var amount = sortedPlaces[i].amount;

		//only show places who are in at least one dream
		if (amount == 0) break;

		//mark the currently filtered place
		var extraclass = "";
		if (id == currentFilteredPlace) {
			extraclass = " filtered";
		}

		html += "<li class='filterbutton" + extraclass + "' onclick='filterByPlace(" + id + ")'>" + name + " (" + amount + ")</li>";
	}
	document.getElementById("list_places").innerHTML = html


	//MOODS

	html = ""
	for (var i=0; i<moods.length; i++) {
		html += "<i class='moodji' title='" + moods[i].desc + "' onclick='filterByMood(" + i + ")'>" + moods[i].symbol + "</i>";
	}
	document.getElementById("list_moods").innerHTML = html
}


function sortByAmount(arr) {
	var ar = arr.slice(0);
	ar.sort(function(a,b){return b.amount - a.amount});
	while (ar[ar.length-1] == undefined) ar.pop();
	return ar;
}

function sortByDate(arr) {
	var ar = arr.slice(0);
	ar.sort(function(a,b){
		if (a.year!=b.year) return b.year-a.year;
		if (a.month!=b.month) return b.month - a.month;
		return b.day - a.day;
	});
	while (ar[ar.length-1] == undefined) ar.pop();
	return ar;
}


function filterByPerson(id) {
	currentFilteredPerson = id;
	document.getElementById("showallpeople").style.visibility = "visible";
	refreshPage();
}
function filterByPlace(id) {
	currentFilteredPlace = id;
	document.getElementById("showallplaces").style.visibility = "visible";
	refreshPage();
}

function filterByMood(id) {
	currentFilteredMood = id;
	document.getElementById("showallmoods").style.visibility = "visible";
	refreshPage();
}

function filterOnlyByPerson(id) {
	currentFilteredPlace = -1;
	document.getElementById("showallplaces").style.visibility = "hidden";
	filterByPerson(id);
}
function filterOnlyByPlace(id) {
	currentFilteredPerson = -1;
	document.getElementById("showallpeople").style.visibility = "hidden";
	filterByPlace(id);
}





function showallpeople() {
	currentFilteredPerson = -1;
	document.getElementById("showallpeople").style.visibility = "hidden";
	refreshPage();
}
function showallplaces() {
	currentFilteredPlace = -1;
	document.getElementById("showallplaces").style.visibility = "hidden";
	refreshPage();
}
function showallmoods() {
	currentFilteredMood = -1;
	document.getElementById("showallmoods").style.visibility = "hidden";
	refreshPage();
}



function assignAmounts(arr,identifier) {

	//create the amount attribute for all elements
	for (var a=0;a<arr.length;a++) {
		if (arr[a] == undefined) continue;
		arr[a]["amount"] = 0;
		console.log("assigning amount 0 to " + arr[a].name);
	}
	console.log("done assigning");

	//go through all dreams, count if person / place appears there
	for (var i=0;i<dreams.length;i++) {
		if (dreams[i] == undefined) continue;
		console.log("now trying to read people in dream " + i);
		for (let item of dreams[i][identifier]) {
			arr[item].amount += 1;
		}
	}


}


function hasMood(mood,num) {
	if (mood == -1) return true;
	id = 0;
	while (2**(id+1) <= num) {
		id++;
	}

	while (num != 0) {
		if (num >= 2**id) {
			if (id == mood) {
				return true;
			}
			num = num - (2**id);
		}

		id--;

	}
	return false;
}


function twodigits(s) {
	if (s>9) return "" + s;
	else return "0" + s;
}




////
////
// ADD NEW STUFF
////
////

function addPerson() {
	createWindow("Person","createPerson()");
}

function addPlace() {
	createWindow("Place","createPlace()");

}

function addDream() {
	createWindowDream();
}

function createWindow(type,funct) {

	bd = document.getElementsByTagName("body")[0];
	bd.innerHTML += `
		<div id="shade">
			<div class="inputwindow">
				<h1 class="header">Add a new ` + type + `</h1>

				<input id="createname" class="biginput" placeholder="Name" />


			</div>

			<div class="button okaybutton" onclick=` + funct + `><h1>Create</h1></div>
			<div class="button cancelbutton" onclick="removeShade()"><h1>Cancel</h1></div>

		</div>

	`;

}

function createWindowDream() {

	bd = document.getElementsByTagName("body")[0];
	bd.innerHTML += `
		<div id="shade">
			<div class="inputwindow biginput">
				<h1 class="header">Add a new Dream</h1>

				<table class="inputfieldtable">
					<tr class="attributelist"><td><input class="smallinput" id="createdream_people" placeholder="People" onfocus="listOptions('people')" oninput="listOptions('people')" /></td></tr>
					<tr class="attributelist"><td><input class="smallinput"id="createdream_places" placeholder="Places" onfocus="listOptions('places')" oninput="listOptions('places')" /></td></tr>
					<tr class="dreamtext" placeholder="Dream description"></tr>
				</table>




			</div>

			<div class="button okaybutton" onclick=createDream()><h1>Create</h1></div>
			<div class="button cancelbutton" onclick="removeShade()"><h1>Cancel</h1></div>

		</div>

	`;

}

function removeDropdowns() {
	try {
		oldnode = document.getElementById("dropdown");
		document.getElementsByTagName("body")[0].removeChild(oldnode);
	}
	catch (e) {

	}
}

function listOptions(cat) {
	try {
		oldnode = document.getElementById("dropdown");
		document.getElementsByTagName("body")[0].removeChild(oldnode);
	}
	catch (e) {

	}
	document.getElementById("createdream_" + cat).focus();
	allOptions = window[cat];
	validOptions = [];
	searchstr = document.getElementById("createdream_" + cat).value.toLowerCase();



	for (var i=0;i<allOptions.length;i++) {
		if (allOptions[i].name.toLowerCase().includes(searchstr)) {
			validOptions.push(allOptions[i]);
		}
	}

	//console.log(validOptions);

	if (validOptions.length > 10) {
		return;
	}

	rect = document.getElementById("createdream_" + cat).getBoundingClientRect();

	newplace_x = rect.x;
	newplace_y = rect.y + rect.height;
	//newplace_x = 0;
	//newplace_y = 20;

	var dropdownhtml = "<table id='dropdownoptions' class='dropdownoptions_" + cat + "' style='position:fixed;top:" + newplace_y + "px;left:" + newplace_x + "px;'>";

	for (var j=0;j<validOptions.length;j++) {
		dropdownhtml += "<tr><td><p onclick='addToList(\"" + validOptions[j].name + "\"," + validOptions[j].id + ",\"" + cat + "\")'>";
		dropdownhtml += validOptions[j].name;
		dropdownhtml += "</p></td></tr>";
	}

	dropdownhtml += "</table>";

	node = document.createElement("div");
	node.innerHTML = dropdownhtml;
	node.setAttribute("id","dropdown");

	console.log(dropdownhtml);

	document.getElementsByTagName("body")[0].appendChild(node);
	//document.getElementById("createdream_" + cat).parentElement.parentElement.innerHTML += dropdownhtml;

	document.getElementById("createdream_" + cat).focus();



}

function addToList(name,id,cat) {
	console.log("Adding to list " + name + " " + id + " " + cat);
	removeDropdowns();

	newtag = document.createElement("p");
	newtag.setAttribute("class","tag tag_" + cat);
	newtag.setAttribute("id","tag_" + cat + "_" + id);
	newtag.innerHTML = name;

	textfield = document.getElementById("createdream_" + cat);
	textfield.value = "";
	textfield.parentElement.insertBefore(newtag,textfield);

}

function removeShade() {
	sh = document.getElementById("shade");
	sh.parentNode.removeChild(sh);
}

function createPerson() {
	name = document.getElementById("createname").value;
	if (name != "") {
		var np = {};
		np.id = people.length;
		np.name = name;
		np.amount = 0;
		people.push(np);
		//assignAmounts(people,"people");
		removeShade();
	}

}

function createPlace() {
	name = document.getElementById("createname").value;
	if (name != "") {
		var np = {};
		np.id = places.length;
		np.name = name;
		np.amount = 0;
		places.push(np);
		//assignAmounts(places,"places");
		removeShade();
	}
	removeShade();
}
