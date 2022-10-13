function GetServers(callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = null;
      var serverStorage = null;
      debugger;
      serverStorage = localStorage.getItem('Servers');
      var parser = new DOMParser();
      if (serverStorage != null) {
        response = parser.parseFromString(serverStorage, "application/xml");
      }
      else {
        response = xhr.responseXML;
      }
      Servers = response.getElementsByTagName('server');
      var xmlForClientConfig = new XMLHttpRequest();
      var startDate = null;
      var estimatedSpeed = null;
      var totalSize = 13232;
      xmlForClientConfig.onloadstart = function (event) {
        startDate = new Date();
      };
      xmlForClientConfig.onload = function () {
        if (xmlForClientConfig.status == 200) {
          estimatedSpeed = ((totalSize * 8) / ((new Date() - startDate) / 1000)) / 1000000;
          var clientResponse = xmlForClientConfig.responseXML;
          var ClientInfo = clientResponse.getElementsByTagName('client')[0];
          // Compute distance from Client for any servers.
          for (var i = 0; i < Servers.length; i++) {
            Servers[i].setAttribute('distance', NearestCity(ClientInfo.getAttribute('lat'), ClientInfo.getAttribute('lon'), Servers[i].getAttribute('lat'), Servers[i].getAttribute('lon')).toString());
          }
          // Sort servers depending on their distance.
          Servers = [].slice.call(Servers).sort(function (a, b) {
            var distanceA = parseFloat(a.getAttribute('distance'));
            var distanceB = parseFloat(b.getAttribute('distance'));
            var result = distanceA - distanceB;
            return result;
          });
          // estimating speed
          var url = Servers[0].getAttribute('url');
          var index = url.lastIndexOf('/');
          url = url.substring(0, index + 1);
          url = url + "/random4000x4000.jpg";
          var period = 4000; // download for the period of 20000 mseconds
          var timeout = 4000; // timeout after 5000 mseconds
          var bytes = [0];
          var total = [0];
          var finished = [false];
          var elapsedTime = 0;
          var r0 = new Request(0);
          r0.timeout = timeout;
          r0.onprogress = e => {
            const db = e.loaded - e.previousRead;
            bytes[e.id] += db;
            total[e.id] += db;
          };
          r0.onload = function () {
            finished[this.id] = true;
            if (finished[0] == true) {
              estimatedSpeed = bytes.reduce((p, c) => p + c, 0) / (period / 1000) / 1024 / 1024;
              callback(Servers, estimatedSpeed);
            }
          };
          var id = window.setInterval(() => {
            main.style.filter = 'grayscale(' + (100 - (((elapsedTime / period) * 100) + 5).toFixed(0)) + '%)';
            prepareProgress.innerText = (((elapsedTime / period) * 100) + 5).toFixed(0) + '%';
            elapsedTime += 100;
          }, 100);
          window.setTimeout(window.clearInterval, period, id);
          txtFindingServer.innerText = "Estimating base speed...";
          r0.open('GET', url, period);
          r0.send();
        }
      };
      txtFindingServer.innerText = "Getting client info...";
      xmlForClientConfig.open('GET', 'http://www.speedtest.net/speedtest-config.php', true);
      xmlForClientConfig.send(null);
    }
  }
  txtFindingServer.innerText = "Preparing active servers...";
  xhr.open('GET', 'Resources/speedtest-servers.xml', true);
  xhr.send(null);
}
