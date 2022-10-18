let jsondata = "";
var to, from;
const loader=document.querySelector("#flightbook form img")
loader.style.display='none'
const startoption = document.getElementById('start')
const destinationoption = document.getElementById('destination')
const srhbtn = document.getElementById('submit')
const flight_info = document.getElementById('flight_info')
flight_info.style.display = 'none'
const flight_select = document.getElementById('flightbook')
const flight_table = document.querySelector("#flight_info table")
const back_btn = document.querySelector("#flight_info button")
console.log(back_btn);
console.log(flight_table)

async function getJson(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}
function timereturn(str) {
    let strarr = str.split("T")
    return `${strarr[0]}-${strarr[1].slice(0, 8)}`
}

async function main() {
    //OPTION 1
    getJson('./Airport.json')
        .then(data => console.log(data));

    //OPTION 2
    jsondata = await getJson('./Airport.json')
    for (let val in jsondata.airports) {
        // console.log(jsondata.airports[val].IATA_code);
        let option = document.createElement('option')
        option.value = jsondata.airports[val].IATA_code
        option.innerHTML = jsondata.airports[val].airport_name
        startoption.appendChild(option)
    }
    for (let val in jsondata.airports) {
        // console.log(jsondata.airports[val].IATA_code);
        let option = document.createElement('option')
        option.value = jsondata.airports[val].IATA_code
        option.innerHTML = jsondata.airports[val].airport_name
        destinationoption.appendChild(option)
    }
    function changeFunc(e) {
        var selectedValue = startoption.options[startoption.selectedIndex].value;
        from = selectedValue;
        console.log(selectedValue);
    }
    function changedestFunc(e) {
        var selectedValue = destinationoption.options[destinationoption.selectedIndex].value;
        to = selectedValue;
        console.log(selectedValue);
    }
    startoption.addEventListener("change", changeFunc);
    destinationoption.addEventListener("change", changedestFunc);

    srhbtn.addEventListener('click', async (e) => {
        e.preventDefault();
        loader.style.display='block'
        const options = {
            method: 'GET',
            headers: {
                'X-Access-Token': '0448bd4f8c88a5e951d4ef09b2097767',
                'X-RapidAPI-Key': 'ab59495411msh2112542eafecc0dp1d6c27jsne593865761c7',
                'X-RapidAPI-Host': 'travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com'
            }
        };

        let response = await fetch(`https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v1/prices/cheap?origin=${from}&page=None&currency=INR&destination=${to}`, options)
        let flightdatajson = await response.json()
        flight_select.style.display = 'none'
        flight_info.style.display = 'flex'
        loader.style.display='none'

        if (flightdatajson.data == null || Object.keys(flightdatajson.data).length === 0) {
            console.log('flight not available');
            let msg= document.createElement('p')
            msg.innerHTML='Flight not Available'
            flight_info.insertBefore(msg, flight_info.firstChild)
            flight_table.remove()
        }
        else {
            let flightarr = flightdatajson.data[`${to}`]
            console.log(flightarr);

            for (var i in flightarr) {
                let onerow = document.createElement('tr')

                onerow.innerHTML = `<td>₹${flightarr[i].price}</td> <td>${flightarr[i].flight_number}</td> <td>${timereturn(flightarr[i].departure_at)}</td> <td>${timereturn(flightarr[i].return_at)}</td>`
                // div.innerHTML = `Price:- ${flightarr[i].price} Departure: ${timereturn(flightarr[i].departure_at)} Return: ${timereturn(flightarr[i].return_at)} Number: ${flightarr[i].flight_number}`;
                // flight_info.appendChild(div)
                flight_table.appendChild(onerow)
                console.log(flightarr[i]);

            }
        }


    })
    back_btn.addEventListener('click', (e) => {
        window.location.reload();
    })
}

main();
