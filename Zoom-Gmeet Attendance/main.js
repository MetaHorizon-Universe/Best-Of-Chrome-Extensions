function pseudo() {
    function exportList(fileName, fileContents) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURI(fileContents);
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName + '.txt';
        hiddenElement.click();
        console.debug(fileContents);
    }

    function gmeet() {
        var current = new Date();
        fileName = '[GMEET] ' + current.toLocaleDateString().replaceAll('/', '-') + ' ' + current.toLocaleTimeString();
        fileContents = `[${current.toLocaleString()}] [${document.location.href}]\n\nParticipants:\n`
        let button = document.querySelector("#ow3 > div.T4LgNb > div > div:nth-child(12) > div.crqnQb > div.UnvNgf.Sdwpn.P9KVBf.IYIJAc.BIBiNe > div.jsNRx > div.fXLZ2 > div > div > div:nth-child(2) > span > button")
        button.click()
        setTimeout(function () {
            for (i = 1; i < 5000; i++) {
                try {
                    userName = document.querySelector(`#ow3 > div.T4LgNb > div > div:nth-child(12) > div.crqnQb > div.R3Gmyc.qwU8Me > div.WUFI9b > div.hWX4r > div.ggUFBf.Ze1Fpc > div.m3Uzve.RJRKn > div > div:nth-child(${i}) > div.SKWIhd > div.zSX24d > div`).textContent
                    fileContents += `${i}. ` + userName + "\n";
                } catch {
                    break;
                }
            }
            exportList(fileName, fileContents);
        }, 1000);
    }

    function zoom() {
        var current = new Date();
        fileName = '[ZOOM] ' + current.toLocaleDateString().replaceAll('/', '-') + ' ' + current.toLocaleTimeString();
        fileContents = `[${current.toLocaleString()}] [${document.location.href}]\n\nParticipants:\n`

        for (i = 0; i < 5000; i++) {
            try {
                userName = document.querySelector(`#participants-list-${i} > div > div.participants-item__left-section > span > span.participants-item__display-name`).textContent
                fileContents += `${i + 1}. ` + userName + "\n";
            } catch {
                break;
            }
        }
        exportList(fileName, fileContents);
    }

    if (document.location.href.includes('meet.google.com')) {
        gmeet();
    }
    else if (document.location.href.includes('.zoom.')) {
        zoom();
    }

}


chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes("meet.google.com") || tab.url.includes(".zoom.")) {
        console.debug("ZOOM/GMEET Export")
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: pseudo
        });
    }
});