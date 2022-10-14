chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  let url = tabs[0].url;
  let fetchRes = fetch(
    `https://phishing-url-detection-backend.herokuapp.com/api/?url=${url}/`
  );
  const data = document.getElementById("data");
  const urlName = document.getElementById("url-name");
  const predictedResult = document.getElementById("predicted-result");
  const legitimateRate = document.getElementById("legitimate-rate");
  const phishingRate = document.getElementById("phishing-rate");

  fetchRes
    .then((res) => res.json())
    .then((d) => {
      urlName.innerText = d.url;
      predictedResult.innerText = d.predictionMade;
      legitimateRate.innerText = d.successRate;
      phishingRate.innerText = d.phishRate;
    });
});
