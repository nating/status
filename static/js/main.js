
TASKS_TO_COMPLETE = 21;

// ~ https://stackoverflow.com/a/3067896
Date.prototype.mmddyyyy = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();
  return [(mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd, this.getFullYear()].join('/');
};

const entries = {};
var sheetrockCallback = function (error, options, response) {
  if (!error) {
    var rows = response.rows;
    const datesAdded = [];

    // Create entries object
    for(var i=rows.length-1;i>=1;i--){ // Last row is most recent
	  var iteration = (rows.length-1) - i;
      var entry = rows[i].cellsArray;
      var date = entry[0].split(" ")[0];
      var tasksComplete = entry[1].split(",").length;
      var dayAlreadyPresent = false;
      if (!entries[date]) {
      	entries[date] = tasksComplete;
      }
    }

    // Setup last 28 days
    var totalRecentTasksComplete = 0;
	for (var i=0;i<28;i++) {
		var day = new Date();
		day.setDate(day.getDate() - i);
		tasksComplete = entries[day.mmddyyyy()] || 0;
		totalRecentTasksComplete += tasksComplete;
	    const progressLevel = Math.floor(tasksComplete / TASKS_TO_COMPLETE * 20);
		const squares = document.getElementById('thirty-days');
		squares.insertAdjacentHTML('beforeend', `<li class="progress-${progressLevel}">${Math.floor(tasksComplete/TASKS_TO_COMPLETE * 100)}</li>`);
	}
	var totalProgress = totalRecentTasksComplete / (TASKS_TO_COMPLETE * 28);
	const circle = document.getElementById("circle");
	circle.classList.add("progress-"+Math.floor(totalProgress * 20));
	circle.innerHTML = `${Math.floor(totalProgress * 100)}%`;

	// Set up current month
	var today = new Date();
	var month = today.mmddyyyy().split("/")[0];
	var year = today.mmddyyyy().split("/")[2];
	var daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
	var firstDayOfTheMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
	for (var i=0;i<Math.abs(firstDayOfTheMonth-1)%7;i++) {
		const squares = document.getElementById('month');
		squares.insertAdjacentHTML('beforeend', `<li></li>`);
	}
	for (var i=1;i<daysInMonth;i++) {
		tasksComplete = entries[`${month}/${i}/${year}`] || 0;
	    const progressLevel = Math.floor(tasksComplete / TASKS_TO_COMPLETE * 20);
		const squares = document.getElementById('month');
		squares.insertAdjacentHTML('beforeend', `<li class="progress-${progressLevel}">${Math.floor(tasksComplete/TASKS_TO_COMPLETE * 100)}</li>`);
	}

  } else {
    console.log("Sheetrock error", error);
	var sheetLink = prompt("Please enter the link to your google sheet.", "");
	var formLink = prompt("Please enter the link to your form.", "");
	setCookie('sheetLink', sheetLink, 365);
	setCookie('formLink', formLink, 365);
  }
};

if (getCookie('sheetLink')) {
	sheetrock({ url: getCookie('sheetLink'), callback: sheetrockCallback });
} else {
	var sheetLink = prompt("Please enter the link to your google sheet.", "");
	var formLink = prompt("Please enter the link to your form.", "");
	setCookie('sheetLink', sheetLink, 365);
	setCookie('formLink', formLink, 365);
	sheetrock({ url: sheetLink, callback: sheetrockCallback });
}

openForm = function() {
	console.log(document.cookie)
	window.open(getCookie('formLink'), '_blank')
}



// ~ https://stackoverflow.com/a/24103596
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


// ~ https://stackoverflow.com/a/27403082
(function () {
	var element = document.getElementById('circle'), start,end;
	element.onmousedown = function () {
	  setTimeout(function() { 
	      if (element.onmousedown=true) {
	      	eraseCookie('sheetLink');
	      	eraseCookie('formLink');
	      }
	  }, 5000);
	};
})();

