const API_KEY = 'f56e8254cbda4cf792d916c023b34d76';

const API_BASE_URL = 'https://newsapi.org/v2';

// {
//     "source": {
//         "id": null,
//         "name": "BBC News"
//     },
//     "author": null,
//     "title": "Scores missing as India landslides kill 158",
//     "description": "More than 180 people are still missing after heavy rains triggered massive landslides in Kerala state.",
//     "url": "https://www.bbc.com/news/articles/cd108y8439po",
//     "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/cdcb/live/0da4ebb0-4ef9-11ef-94f6-4bf59678de16.jpg",
//     "publishedAt": "2024-07-31T06:35:19Z",
//     "content": "The death toll from the massive landslides that have hit the southern Indian state of Kerala has now crossed 158, with officials saying 187 people are still missing.\r\nRescue operations, that had halt… [+2608 chars]"
// }

document.addEventListener('DOMContentLoaded', async () => {
    // const factsApiUrl = 'https://catfact.ninja/facts'; // API URL for cat facts
    // const imagesApiUrl = 'https://api.thecatapi.com/v1/images/search?limit=10'; // Example public API URL for cat images

    // Get the existing 'Featured Posts' section container by its ID
    const postsContainer = document.getElementById('posts-container');

    try {
        // Fetch cat facts and images using async-await
        const response = await fetch(`${API_BASE_URL}/everything?q=india&apiKey=${API_KEY}`);

        // Check if the responses are OK
        if (!response.ok) {
            throw new Error(`HTTP error fetching facts! Status: ${response.status}`);
        }
        // if (!imagesResponse.ok) {
        //     throw new Error(`HTTP error fetching images! Status: ${imagesResponse.status}`);
        // }

        // const factsData = await factsResponse.json(); // Get the JSON data for facts
        const data = await response.json(); // Get the JSON data for images
        // Check if facts and images are returned
        if (data.status && data.articles && data.articles.length) {

            // Populate posts dynamically with the first 3 facts and images
            postsContainer.innerHTML = data?.articles?.slice(0, 9)?.map((fact, index) => `
                <article class="post">
                    <img src="${fact.urlToImage}" alt="Cat Image">
                    <p>${fact.author || ''}</p>
                    <h3>${fact.title}</h3>
                    <p>${fact.description.slice(0, 40)}</p>
                    <p>${fact.publishedAt}</p>
                    <a href="#" class="read-more">Read More</a>
                </article>
            `).join('');
        } else {
            // Handle the case where no facts or images are returned
            postsContainer.innerHTML = '<p>No facts or images available at the moment.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        postsContainer.innerHTML = '<p>Failed to load data. Please try again later.</p>';
    }
});
