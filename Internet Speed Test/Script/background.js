
const periodInMinutes = 1440; // Period in minutes => 24 hours.
const when = 30000; // delay in half of an hour.

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('CheckServers', { when, periodInMinutes });
});


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "CheckServers") {
    var previousDate = null;
    var currentDate = new Date();
    if (localStorage.getItem("PreviousDate")) {
      previousDate = new Date(localStorage.getItem("PreviousDate"));
      var diff = dateDiffInDays(currentDate, previousDate);
      if (diff >= 7) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status === 200) {
            var response = xhr.responseText;
            localStorage.setItem('Servers', response);
            localStorage.setItem("PreviousDate", currentDate);
          }
        }
        xhr.open('GET', 'http://www.speedtest.net/speedtest-servers.php?' + '?r=' + Math.random(), true);
        xhr.send(null);
      }
    }
    else {
      previousDate = new Date();
      localStorage.setItem("PreviousDate", previousDate);
    }
  }
});

var datePerDay = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.abs(Math.floor((utc2 - utc1) / datePerDay));
}