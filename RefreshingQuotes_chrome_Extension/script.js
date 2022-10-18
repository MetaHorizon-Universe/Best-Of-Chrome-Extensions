fetch('https://api.adviceslip.com/advice')
.then(data => data.json())
.then(jokeData => {
    const jokeText=jokeData.slip.advice;
    const jokeElement=document.getElementById('jokeElement');
    jokeElement.innerHTML = jokeText;
})