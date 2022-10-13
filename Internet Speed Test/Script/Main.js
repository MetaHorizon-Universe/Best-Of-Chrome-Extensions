/* ---------------------------------- Initialize Variables ---------------------------------------*/
var footer = document.getElementsByTagName('footer')[0];
var footerElements = footer.getElementsByTagName('li');
var resultPage = document.getElementById('resultsPage');
var settingsPage = document.getElementById('settingsPage');
var btnShowChangeServer = document.getElementById('btnShowChangeServer');
var btnSelectAuto = document.getElementById('btnSelectAuto');
var aboutPage = document.getElementById('aboutPage');
var beginSpeedTestPage = document.getElementById('beginSpeedTestPage');
var pingPage = document.getElementById('pingPage');
var downloadPage = document.getElementById('downloadPage');
var testAgainPage = document.getElementById('testAgainPage');
var uploadPage = document.getElementById('uploadPage');
var pingMenuItem = document.getElementById('pingMenuItem');
var btnBeginSpeedTest = document.getElementById('btnBeginSpeedTest');
var btnTestAgain = document.getElementById('btnTestAgain');
var main = document.getElementsByTagName('main')[0];
var versionNumber = document.getElementById('versionNumber');

var introductionHeader = document.getElementById('introductionHeader');
var humanReadableSpeed = document.getElementById('humanReadableSpeed');
var humanReadableSpeedForUpload = document.getElementById('humanReadableSpeedForUpload');


var downloadMenuItem = document.getElementById('downloadMenuItem');
var uploadMenuItem = document.getElementById('uploadMenuItem');

var pingMenuValue = document.getElementById('pingMenuValue');
var downloadMenuValue = document.getElementById('downloadMenuValue');
var uploadMenuValue = document.getElementById('uploadMenuValue');

var downloadProgress = document.getElementById('downloadProgress');
var uploadProgress = document.getElementById('uploadProgress');

var pingSpinner = document.getElementById('pingSpinner');
var downloadSpinner = document.getElementById('downloadSpinner');
var uploadSpinner = document.getElementById('uploadSpinner');
var txtFindingServer = document.getElementById('txtFindingServer');
var txtBestServer = document.getElementById('txtBestServer');
var txtPingCountry = document.getElementById('txtPingCountry');
var txtPingCity = document.getElementById('txtPingCity');

var connectedInfoHeader = document.getElementById('connectedInfoHeader');
var txtBestServerHeading = document.getElementById('txtBestServerHeading');
var txtPingCountryHeading = document.getElementById('txtPingCountryHeading');
var txtPingCityHeading = document.getElementById('txtPingCityHeading');


var pingResultReport = document.getElementById('pingResultReport');
var txtTestingPing = document.getElementById('txtTestingPing');
var txtHostedByForDownload = document.getElementById('txtHostedByForDownload');
var txtHostedByForUpload = document.getElementById('txtHostedByForUpload');

var pingReplyWrapper = document.getElementById('pingReplyWrapper');

var changeServerPageItem = document.getElementById('changeServerPageItem');

var searchBox = document.getElementById('txtSearch');
var txtServerSelectionName = document.getElementById('txtServerSelectionName');
var txtServerSelectionSponsor = document.getElementById('txtServerSelectionSponsor');
var btnSelectAuto = document.getElementById('btnSelectAuto');
var resultTable = document.getElementById('resultTable');
var prepareProgress = document.getElementById('prepareProgress');


var numberOfNearestServer = 5;
var Servers = [];
var cache = [];
var SelectedServer = null;
var pingTimes = [];
var globalPingCounter = 0;
var pingCounterPerServer = 0;
var globalEstimatedSpeed = 0;
var gaugePressure = null;
var guagePressureForUpload = null;
var serverSelectionMethod = "auto";
var manualServerSelection = null;
var prevServerManual = null;

var rowResult = [0, 0, 0, 0, 0, 0];
var tableResults = [];

var randomFiles = ["random500x500.jpg",
  "random750x750.jpg",
  "random1000x1000.jpg",
  "random1500x1500.jpg",
  "random2000x2000.jpg",
  "random2500x2500.jpg",
  "random3000x3000.jpg",
  "random3500x3500.jpg",
  "random4000x4000.jpg"
]


btnSelectAuto.addEventListener('click', function () {
  serverSelectionMethod = "auto";
  txtServerSelectionName.innerText = "";
  txtServerSelectionSponsor.innerText = "";
  prevServerManual.className = "";
});

changeServerPageItem.addEventListener('click', function (e) {
  if (prevServerManual != null)
    prevServerManual.className = "";
  var index = e.target.getAttribute('index');
  manualServerSelection = Servers[index];
  prevServerManual = e.target;
  serverSelectionMethod = "manual";

  e.target.className = "active";
  // server selection info
  txtServerSelectionName.innerText = manualServerSelection.getAttribute('name');
  txtServerSelectionSponsor.innerText = manualServerSelection.getAttribute('sponsor');
});

document.addEventListener('DOMContentLoaded', function () {
  DisablePagesWhenBeginSpeedTest();

  versionNumber.innerText = chrome.runtime.getManifest().version;
  chrome.storage.local.get('tableResults', function (result) {
    if (result.tableResults != undefined) {
      tableResults = result.tableResults;

      if (tableResults.length > 0) {
        for (var i = 0; i < tableResults.length; i++) {
          resultTable.appendChild(CreateResultRow(tableResults[i]));
        }
      }
    }
  });
  InitializeServers(function () {

  });
});

searchBox.addEventListener('input', ServerFilter);

function ServerFilter() {
  var query = this.value.trim().toLowerCase();
  cache.forEach(function (e) {
    var index = 0;
    var index2 = 0;
    if (query) {
      index = e.name.indexOf(query);
      index2 = e.sponsor.indexOf(query);
    }
    e.element.style.display = index === -1 && index2 === -1 ? 'none' : '';
  });
}

function InitializeServers(callback) {
  GetServers(function (result, estimatedSpeed) {
    EnablePagesWhenBeginSpeedTest();
    btnBeginSpeedTest.className += " active";
    txtFindingServer.className += " hide";
    prepareProgress.innerText = "";
    globalEstimatedSpeed = estimatedSpeed;
    for (var i = 0; i < Servers.length; i++) {
      var div = document.createElement('div');
      var dataAttribute = document.createAttribute('index');
      dataAttribute.value = i;
      div.setAttributeNode(dataAttribute);
      var spanTop = document.createElement('span');
      spanTop.innerText = Servers[i].getAttribute('name') + '(' + Servers[i].getAttribute('country') + ')';
      var spanBottom = document.createElement('span');
      spanBottom.innerText = Servers[i].getAttribute('sponsor') + ' (' + (parseFloat(Servers[i].getAttribute('distance'))).toFixed(0) + 'km)';
      div.appendChild(spanTop);
      div.appendChild(spanBottom);
      changeServerPageItem.appendChild(div);
    }
    var htmlServerList = changeServerPageItem.getElementsByTagName('div');
    for (var i = 0; i < htmlServerList.length; i++) {
      cache.push({
        element: htmlServerList[i],
        name: Servers[i].getAttribute('name').toLowerCase(),
        sponsor: Servers[i].getAttribute('sponsor').toLowerCase()
      });
    }
    gaugePressure = new RadialGauge({
      renderTo: 'canvasPressure',
      width: 270,
      height: 270,
      units: "MBps",
      startAngle: 70,
      ticksAngle: 220,
      colorPlate: "transparent",
      barWidth: "2",
      barShadow: "0",
      colorBar: "#d3d3d3",
      colorBarProgress: "#4686be",
      colorUnits: "#333",
      colorNumbers: "#333",
      needleType: "arrow",
      needleStart: 20,
      needleEnd: 95,
      needleWidth: 4,
      needleCircleSize: 10,
      needleCircleInner: false,
      needleCircleOuter: true,
      needleShadow: false,
      colorNeedle: "#111",
      colorNeedleEnd: "#111",
      colorNeedleCircleOuter: "#111",
      colorNeedleCircleOuterEnd: "#111",
      colorMajorTicks: ["transparent", "#014464", "#014464", "#014464", "#014464",
        "#014464", "#014464", "#014464", "#014464", "#014464", "#014464", "#014464", "#014464", "#014464", "#014464"
      ],
      colorMinorTicks: "#014464",
      minValue: 0,
      maxValue: ComputeGuageMax(1),
      majorTicks: ComputeGuageMajorTicks(1),
      minorTicks: "5",
      strokeTicks: true,
      highlights: [{
        "from": 0,
        "to": 10,
        "color": "transparent"
      }],
      highlightsWidth: 25,
      numbersMargin: 5,
      animation: true,
      value: 0.01,
      animationRule: "linear",
      valueBox: false,
      borders: false,
      borderShadowWidth: 0,
      animateOnInit: true,
      animatedValue: true
    }).draw();


    // guage pressure for upload
    guagePressureForUpload = new RadialGauge({
      renderTo: 'canvasPressureForUpload',
      width: 270,
      height: 270,
      units: "MBps",
      startAngle: 70,
      ticksAngle: 220,
      colorPlate: "transparent",
      barWidth: "2",
      barShadow: "0",
      colorBar: "#d3d3d3",
      colorBarProgress: "#4686be",
      colorUnits: "#333",
      colorNumbers: "#333",
      needleType: "arrow",
      needleStart: 20,
      needleEnd: 95,
      needleWidth: 4,
      needleCircleSize: 10,
      needleCircleInner: false,
      needleCircleOuter: true,
      needleShadow: false,
      colorNeedle: "#111",
      colorNeedleEnd: "#111",
      colorNeedleCircleOuter: "#111",
      colorNeedleCircleOuterEnd: "#111",
      colorMajorTicks: ["transparent", "#014464", "#014464", "#014464", "#014464",
        "#014464", "#014464", "#014464", "#014464", "#014464", "#014464", "#014464", "#014464", "#014464", "#014464"
      ],
      colorMinorTicks: "#014464",
      minValue: 0,
      maxValue: ComputeGuageMax(5),
      majorTicks: ComputeGuageMajorTicks(5),
      minorTicks: "5",
      strokeTicks: true,
      highlights: [{
        "from": 0,
        "to": 10,
        "color": "transparent"
      }],
      highlightsWidth: 25,
      numbersMargin: 5,
      animation: true,
      value: 0.01,
      animationRule: "linear",
      valueBox: false,
      borders: false,
      borderShadowWidth: 0,
      animateOnInit: true,
      animatedValue: true
    }).draw();
  });
}

btnTestAgain.addEventListener('click', function () {
  btnBeginSpeedTest.click();
});

btnBeginSpeedTest.addEventListener('click', function () {
  DisablePagesWhenBeginSpeedTest();
  Reset(); /// rest all settings.
  for (var i = 0; i < numberOfNearestServer; i++) {
    pingTimes[i] = 0;
  }
  HideAllPages();
  beginSpeedTestPage.className += " show";
  pingPage.className += " speedTestShow";
  Ping(Servers, globalPingCounter, function (result) {
    var indexMinimum = 0;
    var minValue = Number.MAX_VALUE;
    for (var i = 0; i < numberOfNearestServer; i++) {
      if (pingTimes[i] != 0 && pingTimes[i] < minValue) {
        indexMinimum = i;
        minValue = pingTimes[i];
      }
    }
    SelectedServer = Servers[indexMinimum];
    pingSpinner.className = "smallSpinner";
    pingMenuValue.className = "activeMenuValue";
    if (serverSelectionMethod == "auto") {
      pingMenuValue.innerText = pingTimes[indexMinimum] + " ms";
      rowResult[4] = pingTimes[indexMinimum] + " ms";
    } else {
      pingMenuValue.innerText = result + " ms";
      rowResult[4] = result + " ms";
    }
    if (serverSelectionMethod == "auto") {
      // server selection info
      txtServerSelectionName.innerText = SelectedServer.getAttribute('name');
      txtServerSelectionSponsor.innerText = SelectedServer.getAttribute('sponsor');
    }
    setTimeout(function () {
      pingReplyWrapper.style.display = "none";
      pingResultReport.className += " show";
      if (serverSelectionMethod == "auto") {
        txtBestServer.innerText = 'Server: ' + SelectedServer.getAttribute('sponsor');
        txtPingCountry.innerText = "Country: " + SelectedServer.getAttribute('country');
        txtPingCity.innerText = "Name: " + SelectedServer.getAttribute('name');
      } else {
        txtBestServer.innerText = 'Server: ' + manualServerSelection.getAttribute('sponsor');
        txtPingCountry.innerText = "Country: " + manualServerSelection.getAttribute('country');
        txtPingCity.innerText = "Name: " + manualServerSelection.getAttribute('name');
      }
      setTimeout(function () {
        introductionHeader.className += " hide";
        connectedInfoHeader.className += " show";
        if (serverSelectionMethod == "auto") {
          txtBestServerHeading.innerText = 'Server: ' + SelectedServer.getAttribute('sponsor');
          txtPingCountryHeading.innerText = "Country: " + SelectedServer.getAttribute('country');
          txtPingCityHeading.innerText = "Name: " + SelectedServer.getAttribute('name');
        } else {
          txtBestServerHeading.innerText = 'Server: ' + manualServerSelection.getAttribute('sponsor');
          txtPingCountryHeading.innerText = "Country: " + manualServerSelection.getAttribute('country');
          txtPingCityHeading.innerText = "Name: " + manualServerSelection.getAttribute('name');
        }
        var currentServer = null;
        if (serverSelectionMethod == "auto") {
          currentServer = SelectedServer;
        } else {
          currentServer = manualServerSelection;
        }

        pingPage.className = "speedTestWrapper";
        downloadPage.className += " speedTestShow";
        downloadSpinner.className += " showSmallSpinner";
        txtHostedByForDownload.innerText = currentServer.getAttribute('sponsor');
        // download callback.
        DownloadSpeed(currentServer, function (result) {
          downloadSpinner.className = "smallSpinner";
          downloadMenuValue.className = "activeMenuValue";
          downloadMenuValue.innerText = HumanFileSize((result.reduce((p, c) => p + c, 0) / 0.5));
          rowResult[2] = HumanFileSize((result.reduce((p, c) => p + c, 0) / 0.5));
          downloadPage.className = "speedTestWrapper";
          uploadPage.className += " speedTestShow";
          txtHostedByForUpload.innerText = currentServer.getAttribute('sponsor');
          uploadSpinner.className += " showSmallSpinner";

          // upload callback.
          UploadSpeed(currentServer, function (uploadResult) {
            EnablePagesWhenBeginSpeedTest();
            uploadSpinner.className = "smallSpinner";
            testAgainPage.className += " speedTestShow";
            uploadPage.className = "speedTestWrapper";
            uploadMenuValue.className = "activeMenuValue";
            uploadMenuValue.innerText = HumanFileSize(uploadResult / 0.5);
            var currentDate = new Date();
            rowResult[3] = HumanFileSize(uploadResult / 0.5);
            rowResult[1] = currentDate.getHours() + ':' + currentDate.getMinutes();
            rowResult[0] = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate();
            rowResult[5] = currentServer.getAttribute('sponsor');
            if (tableResults.length < 10) {
              tableResults.unshift(rowResult);
            } else {
              tableResults.unshift(rowResult);
              tableResults.splice(tableResults.length - 1, 1);
            }
            var existingRows = document.getElementsByClassName('resultTable-row');
            var existingRowsLength = existingRows.length;
            for (var i = 0; i < existingRowsLength - 1; i++) {
              existingRows[existingRows.length - 1].remove();
            }
            for (var i = 0; i < tableResults.length; i++) {
              resultTable.appendChild(CreateResultRow(tableResults[i]));
            }
            chrome.storage.local.set({
              'tableResults': tableResults
            });
          });
        });
      }, 5000)

    }, 3000);
  });
});

function CreateResultRow(rowResult) {
  var parent = document.createElement('div');
  parent.className = "resultTable-row";
  var headerDiv = document.createElement('div');
  headerDiv.className = "resultTable-row-header";
  headerDiv.innerText = rowResult[5];
  parent.appendChild(headerDiv);
  var timeDiv = document.createElement('div');
  timeDiv.className = "resultTable-heading-cell timeSection";
  var dateSpan = document.createElement('span');
  dateSpan.innerText = rowResult[0];
  var timeSpan = document.createElement('span');
  timeSpan.innerText = rowResult[1];
  timeDiv.appendChild(dateSpan);
  timeDiv.appendChild(timeSpan);
  parent.appendChild(timeDiv);
  var downloadDiv = document.createElement('div');
  downloadDiv.className = "resultTable-heading-cell";
  var downloadSpan = document.createElement('span');
  downloadSpan.innerText = rowResult[2];
  downloadDiv.appendChild(downloadSpan);
  parent.appendChild(downloadDiv);
  var uploadDiv = document.createElement('div');
  uploadDiv.className = "resultTable-heading-cell";
  var uploadSpan = document.createElement('span');
  uploadSpan.innerText = rowResult[3];
  uploadDiv.appendChild(uploadSpan);
  parent.appendChild(uploadDiv);
  var pingDiv = document.createElement('div');
  pingDiv.className = "resultTable-heading-cell";
  var pingSpan = document.createElement('span');
  pingSpan.innerText = rowResult[4];
  pingDiv.appendChild(pingSpan);
  parent.appendChild(pingDiv);
  return parent;
}

function Ping(servers, serverIndex, pingCallBack) {
  if (serverSelectionMethod == "auto") {
    if (serverIndex >= numberOfNearestServer) {
      pingCallBack();
      return;
    }
    var sendDate = (new Date()).getTime();
    var xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    var newElement = null;
    newElement = document.createElement("p");
    newElement.className = "beforeReplyState";
    newElement.innerText = "Reply from: " + servers[globalPingCounter].getAttribute('sponsor') + ": ";
    pingReplyWrapper.appendChild(newElement);
    xhr.onload = function () {
      if (xhr.status == 200) {
        var receiveDate = (new Date()).getTime();
        if (globalPingCounter != numberOfNearestServer) {
          pingTimes[globalPingCounter] = receiveDate - sendDate;
          pingTimes[globalPingCounter] = pingTimes[globalPingCounter] / 2;
          globalPingCounter++;
          newElement.className = "";
          newElement.innerText = newElement.innerText + pingTimes[globalPingCounter - 1] + " ms";
          Ping(servers, globalPingCounter, pingCallBack);
        }
      }
    };
    xhr.onprogress = function (event) { };
    xhr.onerror = function () {
      if (serverIndex < numberOfNearestServer) {
        newElement.className = "noReplyPing";
        newElement.innerText = newElement.innerText + "No reply";
        pingReplyWrapper.appendChild(newElement);
        globalPingCounter++;
        Ping(Servers, globalPingCounter, pingCallBack);
      } else {
        pingCallBack();
      }
    };
    xhr.ontimeout = function () {
      if (serverIndex < numberOfNearestServer) {
        newElement.className = "noReplyPing";
        newElement.innerText = newElement.innerText + "No reply";
        pingReplyWrapper.appendChild(newElement);

        globalPingCounter++;
        Ping(Servers, globalPingCounter, pingCallBack);
      } else {
        pingCallBack();
      }
    }
    xhr.open('GET', 'http://' + servers[serverIndex].getAttribute('host'), true);
    xhr.send(null);
  } else {
    var sendDate = (new Date()).getTime();
    var xhr = new XMLHttpRequest();
    xhr.timeout = 5000;
    var newElement = null;
    newElement = document.createElement("p");
    newElement.className = "beforeReplyState";
    newElement.innerText = "Reply from: " + manualServerSelection.getAttribute('sponsor') + ": ";
    pingReplyWrapper.appendChild(newElement);
    xhr.onload = function () {
      if (xhr.status == 200) {
        var receiveDate = (new Date()).getTime();
        newElement.className = "";
        newElement.innerText = newElement.innerText + ((receiveDate - sendDate) / 2) + " ms";
        pingCallBack((receiveDate - sendDate) / 2);
      }
    };
    xhr.onerror = function () {
      newElement.className = "noReplyPing";
      newElement.innerText = newElement.innerText + " No reply";
      pingReplyWrapper.appendChild(newElement);
      pingCallBack('error');
    };
    xhr.ontimeout = function () {
      newElement.className = "noReplyPing";
      newElement.innerText = newElement.innerText + " No reply";
      pingReplyWrapper.appendChild(newElement);
      pingCallBack('timeout');
    };
    xhr.open('GET', 'http://' + manualServerSelection.getAttribute('host'), true);
    xhr.send(null);
  }

}
function GetRandomFile(sizeInKilobyte) {
  if (sizeInKilobyte <= 494) return 0;
  if (sizeInKilobyte <= 1126.4) return 1;
  if (sizeInKilobyte <= 1945.6) return 2;
  if (sizeInKilobyte <= 4403.2) return 3;
  if (sizeInKilobyte <= 7680) return 4;
  if (sizeInKilobyte <= 12288) return 5;
  if (sizeInKilobyte <= 17408) return 6;
  if (sizeInKilobyte <= 23552) return 7;
  return 8;
}
function DownloadSpeed(selectedServer, downloadCallBack) {
  /* speed test example */
  var url = selectedServer.getAttribute('url');
  var index = url.lastIndexOf('/');
  url = url.substring(0, index + 1);
  url = url + "/random4000x4000.jpg";
  var period = 10000; // download for the period of 20000 mseconds
  var timeout = 10000; // timeout after 5000 mseconds
  var update = 500; // update speed every 500 mseconds
  var bytes = [0, 0, 0];
  var total = [0, 0, 0];
  var returnTotal = 0;
  var finished = [false, false, false];
  var [r0, r1, r2] = [new Request(0), new Request(1), new Request(2)];
  r0.timeout = r1.timeout = r2.timeout = timeout;
  r0.onprogress = r1.onprogress = r2.onprogress = e => {
    const db = e.loaded - e.previousRead;
    bytes[e.id] += db;
    total[e.id] += db;
  };
  r0.onload = r1.onload = r2.onload = function () {
    finished[this.id] = true;

    if (finished[0] == true && finished[1] == true && finished[2] == true) {
      downloadCallBack(bytes);
    }
  };
  r0.open('GET', url, period);
  r1.open('GET', url, period - 2000);
  r2.open('GET', url, period - 3000);
  r0.send(null);
  window.setTimeout(() => r1.send(), 2000); // start r1 with 2 second delay
  window.setTimeout(() => r2.send(), 3000); // start r2 with 3 seconds delay
  // speed measure
  var id = window.setInterval(() => {
    gaugePressure.value = (bytes.reduce((p, c) => p + c, 0) / (update / 1000) / 1024 / 1024);
    humanReadableSpeed.innerText = HumanFileSize((bytes.reduce((p, c) => p + c, 0) / 0.5));
    downloadProgress.value = downloadProgress.value + 100 / (period / (update));
    bytes = [0, 0, 0];
  }, update); // update every 500 mseconds
  window.setTimeout(window.clearInterval, period, id);
  // error handling
  r0.onerror = r1.onerror = r2.onerror = (e) => {
    r0.abort();
    r1.abort();
    r2.abort();
    window.clearInterval(id);
  };
}

function UploadSpeed(selectedServer, uploadCallBack) {
  var url = selectedServer.getAttribute('url');
  var period = 10000; // download for the period of 20000 mseconds
  var timeout = 10000; // timeout after 5000 mseconds
  var update = 500;
  var bytes = 0;
  var total = 0;
  var finished = [false];
  var speed = 0;
  var prevDate = null;
  var currentDate = null;
  var r0 = new Request();
  r0.timeout = timeout;
  r0.upload.onprogress = e => {
    const db = e.loaded - e.previousReadForUpload;
    if (db !== 0) {
      bytes = db;
      total = db;
    }
    currentDate = new Date();
    if (prevDate != null) {
      humanReadableSpeedForUpload.innerText = HumanFileSize((bytes / ((currentDate - prevDate) / 1000)));
      guagePressureForUpload.value = (bytes / ((currentDate - prevDate) / 1000) / 1024 / 1024);
    }
    prevDate = currentDate;
  };
  r0.onload = function () {
    estimatedSpeed = bytes;
    uploadCallBack(estimatedSpeed);
  };
  r0.open('POST', url, period);
  r0.send(new ArrayBuffer(1 * 1024 * 1024 * 15));
  var id = window.setInterval(() => {
    uploadProgress.value = uploadProgress.value + 100 / (period / (update));
  }, update); // update every 500 mseconds
  window.setTimeout(window.clearInterval, period, id);
}

function NearestCity(clientLat, clientLog, serverLat, serverLog) {
  var dif = PythagorasEquirectangular(clientLat, clientLog, serverLat, serverLog);
  return dif;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}
// Convert Degress to Radians
function Deg2Rad(deg) {
  return deg * Math.PI / 180;
}

var pages = document.querySelectorAll('.page');

document.addEventListener('click', function (e) {
  if (e.target.id == 'btnShowChangeServer') {
    btnSelectAuto.className = "";
    btnShowChangeServer.className = "activeSelectionServer";
  }
  if (e.target.id == "btnSelectAuto") {
    btnShowChangeServer.className = "";
    btnSelectAuto.className = "activeSelectionServer";
  }
});
footer.addEventListener('click', function (e) {
  if (e.target.nodeName.toLowerCase() == 'li') {
    for (var i = 0; i < footerElements.length; i++) {
      footerElements[i].className = "";
    }
    e.target.className = "active";

    if (e.target.id == "btnShowResults") {
      HideAllPages();
      resultPage.className += " show";
    } else if (e.target.id == "btnShowSpeedTest") {
      HideAllPages();
    } else if (e.target.id == "btnShowSettings") {
      HideAllPages();
      settingsPage.className += " show";
    } else if (e.target.id == "btnShowAbout") {
      HideAllPages();
      aboutPage.className += " show";
    }
  }
});

function HideAllPages() {
  for (var i = 0; i < pages.length; i++) {
    pages[i].className = "page";
  }
  pingPage.className = "speedTestWrapper";
  downloadPage.className = "speedTestWrapper";
  testAgainPage.className = "speedTestWrapper";

  downloadMenuItem.className = "";
  pingMenuValue.className = "";
  downloadMenuValue.className = "";
  uploadMenuValue.className = "";
}

function ComputeGuageMax(ratio) {
  var estimatedSpeed = globalEstimatedSpeed / ratio;
  if (estimatedSpeed < 0.1) {
    return 1;
  }
  if (estimatedSpeed < 1) {
    return 5;
  }
  if (estimatedSpeed < 10) {
    return 10;
  }
  if (estimatedSpeed < 20) {
    return 20;
  }
  if (estimatedSpeed < 30) {
    return 30
  }
  if (estimatedSpeed < 40) {
    return 40
  }
  if (estimatedSpeed < 50) {
    return 50
  }
  if (estimatedSpeed >= 50) {
    return 100;
  }
}

function ComputeGuageMajorTicks(ratio) {
  var estimatedSpeed = globalEstimatedSpeed / ratio;
  if (estimatedSpeed < 0.1) {
    return ["0.0", "0.2", "0.4", "0.6", "0.8", "1.0"];
  }
  if (estimatedSpeed < 1) {
    return ["0", "1", "2", "3", "4", "5"];
  }
  if (estimatedSpeed < 10) {
    return ["0", "2", "4", "6", "8", "10"];
  }
  if (estimatedSpeed < 20) {
    return ["0", "4", "8", "12", "16", "20"];
  }
  if (estimatedSpeed < 30) {
    return ["0", "6", "12", "18", "24", "30"];
  }
  if (estimatedSpeed < 40) {
    return ["0", "8", "16", "24", "32", "40"];
  }
  if (estimatedSpeed < 50) {
    return ["0", "10", "20", "30", "40", "50"];
  }
  if (estimatedSpeed >= 50) {
    return ["0", "20", "40", "60", "80", "100"];
  }
}

var timers = [];

function animateGauges() {
  document.gauges.forEach(function (gauge) {
    timers.push(setInterval(function () {
      gauge.value = Math.random() *
        (gauge.options.maxValue - gauge.options.minValue) +
        gauge.options.minValue;
    }, gauge.animation.duration + 50));
  });
}

function DisablePagesWhenBeginSpeedTest() {
  btnShowSpeedTest.className = "disablePage";
  btnShowResults.className = "disablePage";
  btnShowSettings.className = "disablePage";
  btnShowAbout.className = "disablePage";
}

function EnablePagesWhenBeginSpeedTest() {
  btnShowSpeedTest.className = "Active";
  btnShowResults.className = "";
  btnShowSettings.className = "";
  btnShowAbout.className = "";
}

function Reset() {
  globalPingCounter = 0;
  gaugePressure.value = 0;
  guagePressureForUpload.value = 0;
  downloadProgress.value = 0;
  uploadProgress.value = 0;
  pingSpinner.className = "smallSpinner showSmallSpinner";
  pingMenuValue.className = "";
  pingReplyWrapper.style.display = "flex";
  while (pingReplyWrapper.firstChild.nextSibling) {
    pingReplyWrapper.removeChild(pingReplyWrapper.firstChild.nextSibling);
  }
  var headerElement = document.createElement('h3');
  headerElement.innerText = "Testing ping for optimal server(s) ...";
  pingReplyWrapper.appendChild(headerElement);
  pingResultReport.className = "pingResultReport";
  introductionHeader.className = "introductionHeader";
  connectedInfoHeader.className = "connectedInfoHeader";
  humanReadableSpeed.innerText = "";
  humanReadableSpeedForUpload.innerText = "";
}

function HumanFileSize(bytes) {
  var thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes.toFixed(1) + ' B';
  }
  var units = ['KBps', 'MBps', 'GBps', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
}

