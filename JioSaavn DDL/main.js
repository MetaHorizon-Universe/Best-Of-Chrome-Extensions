async function download() {
    let songurl = "https://www.jiosaavn.com/" + document.querySelector("#player > div.c-player__panel > figure > figcaption > h4 > a").attributes[4].textContent;
    let response = await fetch(songurl);
    let html = await response.text();
    let regxResult = html.match(/\"song_id\":\"(.+?)\"/);
    let songID = regxResult[1];

    response = await fetch("https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=" + songID);
    json = await response.json();
    console.debug(json[songID]['song']);
    let downloadurl = 'https://sdlhivkcdnems04.cdnsrv.jio.com/jiosaavn.cdn.jio.com/';
    let mediaurl = json[songID]['media_preview_url'].replace('https://preview.saavncdn.com/', '');
    downloadurl += mediaurl.replace('96_p', '320');
    window.open(downloadurl)
}

chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes("www.jiosaavn.com")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: download
        });
    }
});