const activities = document.getElementById("category");
activities.addEventListener("change", handleCategoryChange);

document.addEventListener("DOMContentLoaded", callAPI, false);

function handleCategoryChange () {
  storeInChromeStorage();
  callAPI();
}

function storeInChromeStorage()
{
  const a = activities.value;
  chrome.storage.sync.set({'storedQuery': a});
}

function getRandomImage(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function reqListener () {
  let response = JSON.parse(this.responseText)
  if (!response.totalHits || (response.totalHits === 0)) {
  	console.error('No images found')
  } else {
  	let index = getRandomImage(0, response.hits.length - 1)
  	let url = response.hits[index]['largeImageURL']
  	let backgroundImageEle = document.getElementById('background-image')
  	backgroundImageEle.style.backgroundImage = "url('" + url + "')"
  }
}

function callAPI() {
  const oReq = new XMLHttpRequest();

  const API_KEY = '7159995-77ef52f978ebf70313e64948f';
  let URL = "";
  chrome.storage.sync.get('storedQuery', function (result) {
    let query = result.storedQuery;
    if (!query) {
      query = 'Adventure'
    }
    activities.value = query

    URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(query)+"&image_type=photo&pretty=true&per_page=50&response_group=high_resolution";
    oReq.open("GET", URL);
    oReq.send();
  });
  oReq.addEventListener("load", reqListener);
}
