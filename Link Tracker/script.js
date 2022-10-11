let save = document.getElementById('save');
let input = document.getElementById('input');
let tab = document.getElementById('tab');
let myLead = [];
let ulEl = document.getElementById('ul-El');
let leadFromLocalstorage = JSON.parse(localStorage.getItem('myLead'));
// delete is a keyword so we use deleted
let deleted = document.getElementById('deleted');

if (leadFromLocalstorage) {
    myLead = leadFromLocalstorage;
    renderLeads();
}

function renderLeads() {
    let listItems = "";
    for (i = 0; i < myLead.length; i++) {
        //  WE USE INNERhtml TO ALSO ADD LI TAG
        listItems += "<li><a target='_blank' href=' " + myLead[i] + " ' >" + myLead[i] + "</a> </li>";

        // // we use another method then this
        // let li = document.createElement("li");
        // li.innerText += myLead[i];
        // ulEl.append(li);
    }
    ulEl.innerHTML = listItems;
}

deleted.addEventListener('click', () => {
    if (confirm("Do You Really Want To Clear All Link's ? ")) {
        localStorage.clear();
        myLead = [];
        renderLeads();
    }
})

save.addEventListener('click', () => {
    myLead.push(input.value);
    // to make title empty after save is clicked we need to target its value
    localStorage.setItem('myLead', JSON.stringify(myLead));

    renderLeads();
    input.value = '';
})



tab.addEventListener('click', () => {
    // chrome.tab is an API
    // active true is for active tabs link

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        myLead.push(tabs[0].url);
        localStorage.setItem('myLead', JSON.stringify(myLead));
        renderLeads(myLead);

    })

})