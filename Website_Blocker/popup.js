let submitBtn = document.querySelector('#blockSite');
let api = document.querySelector('#inputWebsite');

let toastError = document.querySelector('.toast-error');
let toastSuccess = document.querySelector('.toast-success');
let loader = document.querySelector('.loading');

8

let blockUrls=["wix"];
chrome.storage.local.set({ "website": JSON.stringify(blockUrls) }, function() { console.log("done") });

submitBtn.addEventListener('click', () => {
    if(api.value){
        chrome.storage.local.get(["website"], function (result) {
            blockUrls = JSON.parse(result.website);
        });
        blockUrls.push(api.value);
        chrome.storage.local.set({ "website": JSON.stringify(blockUrls) }, function() { console.log("done") });

        blockUrls.forEach((domain, index) => {
            let id = index + 1;
        
            chrome.declarativeNetRequest.updateDynamicRules(
               {addRules:[{
                  "id": id,
                  "priority": 1,
                  "action": { "type": "block" },
                  "condition": {"urlFilter": domain, "resourceTypes": ["main_frame"] }}
                 ],
                 removeRuleIds: [id]
               },
            )
        })
        toastSuccess.textContent = "Site Blocked Successfully";
        toastSuccess.classList.remove('d-hide')
        setTimeout(() => {
            toastSuccess.classList.add('d-hide')
        },1000)
    }else{
        toastError.classList.remove('d-hide')
        setTimeout(() => {
            toastError.classList.add('d-hide')
        },1000)
    }
})