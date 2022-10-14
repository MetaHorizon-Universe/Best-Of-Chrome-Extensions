fetch("https://type.fit/api/quotes")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    let a=document.getElementById('quote');
    let randomNumber = Math.floor(Math.random() * 100) + 0;
    a.innerHTML=data[randomNumber].text;
  });