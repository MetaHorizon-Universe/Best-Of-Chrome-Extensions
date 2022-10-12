fetch('https://gnews.io/api/v4/search?q=example&token=11f7c77e07dac3224065f9f136832cfa')
    .then(data => data.json())
    .then(newsData => {
        const newsText = newsData.articles[1].description;
        const newsElement = document.getElementById('news');
        newsElement.innerHTML = newsText;
    })
    