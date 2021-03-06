

var currentFilteredPerson = -1;
var currentFilteredPlace = -1;
var currentFilteredMood = -1;




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

			image = personpic(id)
			peopleicons += "<img class='filterbutton person' onclick='filterOnlyByPerson(" + id + ")' src='" + image + "' title='" + people[id].name + "'></img>";
		}

		//create the little icons for places
		var placeicons = "";
		for (let item of sortedDreams[i].places) {
			var id = item;
			console.log("creating icon for place " + id);
			//find in places database

			image = placepic(id)
			placeicons += "<img class='filterbutton place' onclick='filterOnlyByPlace(" + id + ")' src='" + image + "' title='" + places[id].name + "'></img>";
		}

		var dreamcontent = sortedDreams[i].content;
		var date = "" + twodigits(sortedDreams[i].day) + "." + twodigits(sortedDreams[i].month) + "." + sortedDreams[i].year;


		//create mood emojis
		moodlist = moodint_to_moods(sortedDreams[i].mood)
		var moodjis = ""; //end me


		moodlist.forEach(function(mood) {
			moodjis = "<i class='moodji' title='" + mood.desc + "' onclick='filterByMood(" + mood.id + ")'>" + mood.symbol + "</i>" + moodjis;
		});



		//check if lucid
		if (sortedDreams[i].lucid) {
			classes = "lucid dream";
		}
		else {
			classes = "dream";
		}



		//create the div element for the dream entry
		html += "<div class='" + classes + "'><p class='dream_date'>" + date + "  " + moodjis + "</p><p class='dream_attributes'>" + peopleicons + "        " + placeicons + "</p><p class='dream_content'>" + dreamcontent + "</p><img src='icon_edit.png' onclick=editDream(" + sortedDreams[i].id + ") class='edit_dream_button' /></div>";



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

		html += "<li class='filterbutton" + extraclass + "' onclick='filterByPerson(" + id + ")'>" + name + " (" + amount + ") <img class='edit_person_button' onclick='editPerson(" + id + ")' src='icon_edit.png'/></li>";
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

		html += "<li class='filterbutton" + extraclass + "' onclick='filterByPlace(" + id + ")'>" + name + " (" + amount + ") <img class='edit_person_button' onclick='editPlace(" + id + ")' src='icon_edit.png'/></li>";
	}
	document.getElementById("list_places").innerHTML = html


	//MOODS

	html = ""
	for (var i=0; i<moods.length; i++) {
		html += "<i class='moodji' title='" + moods[i].desc + "' onclick='filterByMood(" + i + ")'>" + moods[i].symbol + "</i>";
	}
	document.getElementById("list_moods").innerHTML = html
}




// Filtering

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











////
////
// WINDOWS TO ADD AND EDIT STUFF
////
////

/*
	On reading these following lines, you might be tempted to think "Krateng, why is the function for the
	window to create people and places generic and its parameters define the details, while the function
	for the window to create dreams contains the logic itself? That makes no sense!"
	And to this I say: https://www.youtube.com/watch?v=b3_lVSrPB6w
*/

function addPerson() {
	createWindow("Add a new Person","Create","createPerson()","");
}

function addPlace() {
	createWindow("Add a new Place","Create","createPlace()","");

}

function editPerson(id) {
	createWindow("Edit Person","Save","changePerson(" + id + ")",people[id].name,personpic(id,true));
}
function editPlace(id) {
	createWindow("Edit Place","Save","changePlace(" + id + ")",places[id].name,placepic(id,true));
}

function addDream() {
	createWindowDream(null);
}

function editDream(id) {
	createWindowDream(id)
}

function createWindow(type,submit,funct,name,img) {

	bg_style = ((img == undefined || img == null) ? "" : "background-image:url('" + img + "');")

	bd = document.getElementsByTagName("body")[0];
	bd.innerHTML += `
		<div id="shade" ondragover="dragover(event)" ondrop="readImageFile(event)">
			<!-- You can drag it anywhere on the screen! -->
			<table class="inputwindow inputwindow-small">
				<tr class="header"><td colspan=2>` + type + `</td></tr>
				<tr><td>
				<input id="createname" class="biginput" placeholder="Name" value="` + name + `" />
				</td>
				<td><div id="picture_create" class="picture_create" style="` + bg_style + `"></div></td>
				</tr>


				<tr><td colspan=2>
				<div class="button okaybutton" onclick=` + funct + `>` + submit + `</div>
				<div class="button cancelbutton" onclick="removeShade()">Cancel</div>
				</td></tr>





			</table>

		</div>

	`;

}

function createWindowDream(id) {

	title = ((id == null) ? "Add a new dream" : "Edit dream");
	button = ((id == null) ? "<div class='button okaybutton' onclick=createDream()>Create</div>" : "<div class='button okaybutton' onclick=changeDream(" + id + ")>Save</div>");
	moodlist = ((id == null) ? [] : moodint_to_moods(dreams[id].mood))

	moodlethtml = ""
	for (var i=0;i<moods.length;i++) {
		mood = moods[i];
		cls = ((moodlist.includes(mood)) ? "moodlet-active" : "moodlet-inactive")
		moodlethtml += "<span class='" + cls + "' title='" + mood["desc"] + "' onclick='triggerMoodlet(this)' id='moodlet-" + mood["name"] + "'>" + mood["symbol"] + "</span>"
	}

	bd = document.getElementsByTagName("body")[0];
	bd.innerHTML += `
		<div id="shade">
			<table class="inputwindow inputwindow-big">
				<tr class="header"><td>
				` + title + `
				</td></tr>
				<tr class="inputs"><td>

				<table class="inputfieldtable">
					<tr class="attributelist"><td id="createdream_people_list">
						<input class="smallinput" id="createdream_people" placeholder="People" onfocus="listOptions('people')" oninput="listOptions('people')" />
					</td></tr>
					<tr class="attributelist"><td id="createdream_places_list">
						<input class="smallinput" id="createdream_places" placeholder="Places" onfocus="listOptions('places')" oninput="listOptions('places')" />
					</td></tr>

					<tr class="dreamtext"><td>
						<textarea class="biginput" placeholder="Dream description" id="createdream_desc" rows="10"></textarea>
					</td></tr>

					<tr class="moodletbar"><td id="createdream_moodlets">`
						+ moodlethtml +
					`</td></tr>
				</table>

				</td></tr>

				<tr class="buttons"><td>

				` + button + `
				<div class="button cancelbutton" onclick="removeShade()">Cancel</div>

				</td></tr>

			</table>



		</div>

	`;

	if (id != null) {
		dr = dreams[id]
		document.getElementById("createdream_desc").value = dr.content
		for (let id of dr.places) {
			addToList(places[id].name,id,"places")
		}
		for (let id of dr.people) {
			addToList(people[id].name,id,"people")
		}
	}

}

function triggerMoodlet(e) {
	if (e.classList.contains("moodlet-active")) {
		e.classList.remove("moodlet-active");
		e.classList.add("moodlet-inactive");
	}
	else if (e.classList.contains("moodlet-inactive")) {
		e.classList.remove("moodlet-inactive");
		e.classList.add("moodlet-active");
	}
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

	// remove old dropdown
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

	// check which people / places match the search string
	for (var i=0;i<allOptions.length;i++) {
		if (allOptions[i] == undefined) {
			continue;
		}
		if (allOptions[i].name.toLowerCase().includes(searchstr)) {
			validOptions.push(allOptions[i]);
		}
	}

	//console.log(validOptions);
	// don't show dropdown when search is still too wide
	if (validOptions.length > 10) {
		return;
	}

	// calc position for dropdown
	rect = document.getElementById("createdream_" + cat).getBoundingClientRect();

	newplace_x = rect.x;
	newplace_y = rect.y + rect.height;
	//newplace_x = 0;
	//newplace_y = 20;

	var dropdownhtml = "<table id='dropdownoptions' class='dropdownoptions_" + cat + "' style='position:fixed;top:" + newplace_y + "px;left:" + newplace_x + "px;'>";

	for (var j=0;j<validOptions.length;j++) {
		name = validOptions[j].name
		id = validOptions[j].id
		if (cat=="places") {
			img = "url(\"" + placepic(id) + "\")"
		}
		else {
			img = "url(\"" + personpic(id) + "\")"
		}
		dropdownhtml += "<tr><td>"
		dropdownhtml += "<p onclick='addToList(\"" + name + "\"," + id + ",\"" + cat + "\")' style='background-image:" + img + "'>";
		dropdownhtml += validOptions[j].name;
		dropdownhtml += "</p></td></tr>";
	}

	dropdownhtml += "</table>";

	node = document.createElement("div");
	node.innerHTML = dropdownhtml;
	node.setAttribute("id","dropdown");

	document.getElementsByTagName("body")[0].appendChild(node);
	//document.getElementById("createdream_" + cat).parentElement.parentElement.innerHTML += dropdownhtml;

	document.getElementById("createdream_" + cat).focus();



}

// add selected entry from dropdown to list in dream creation
function addToList(name,id,cat) {
	removeDropdowns();

	if (cat=="places") {
		img = "url(\"" + placepic(id) + "\")"
	}
	else {
		img = "url(\"" + personpic(id) + "\")"
	}

	newtag = document.createElement("p");
	newtag.setAttribute("class","tag tag_" + cat);
	newtag.setAttribute("style","background-image:" + img)
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
