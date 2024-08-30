const API_KEY = 'f56e8254cbda4cf792d916c023b34d76';
const API_BASE_URL = 'https://newsapi.org/v2';

if (window.location.pathname?.includes('/')) {
  document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('posts-container');
    const sliderContainer = document.querySelector('.slider');

    try {
      const response = await fetch(`${API_BASE_URL}/everything?q=india&apiKey=${API_KEY}`);

      if (!response.ok) {
        throw new Error(`HTTP error fetching articles! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.status === 'ok' && data.articles.length) {
        // Populate the posts container
        postsContainer.innerHTML = data.articles
          .slice(0, 9)
          .map(
            (article, index) => `
            <article class="post">
              <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" alt="Image">
              <p>${article.author || ''}</p>
              <h3>${article.title}</h3>
              <p>${article.description.slice(0, 40)}</p>
              <p>${new Date(article.publishedAt).toLocaleString()}</p>
              <button class="read-more" data-index="${index}">Read More</button>
            </article>
          `
          )
          .join('');

        // Add event listeners to "Read More" buttons
        document.querySelectorAll('.read-more').forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const index = e.target.getAttribute('data-index');
            createDetailPage(data.articles[index]);
          });
        });

        // Populate the slider with images and descriptions
        populateSlider(data.articles);
      } else {
        postsContainer.innerHTML = '<p>No articles available at the moment.</p>';
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      postsContainer.innerHTML = '<p>Failed to load data. Please try again later.</p>';
    }
  });
}

// Function to populate the slider with images and descriptions
function populateSlider(articles) {
  const sliderContainer = document.querySelector('.slider');

  // Create slide elements from the articles
  const slidesHTML = articles
    .slice(0, 3) // Adjust number of slides as needed
    .map(article => `
      <div class="slide">
        <img src="${article.urlToImage || 'https://via.placeholder.com/334x188'}" alt="Slide Image">
        <div class="slide-description">
          <h3>${article.title}</h3>
          <p>${article.description.slice(0, 100)}...</p>
        </div>
      </div>
    `)
    .join('');

  // Set the inner HTML of the slider container
  sliderContainer.innerHTML = slidesHTML;

  // Initialize or refresh the slider if using a library
  initializeSlider();
}

// Function to initialize or refresh the slider
// Function to initialize or refresh the slider
function initializeSlider() {
    const slider = document.querySelector('.slider');
    const slides = Array.from(slider.children);
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    
    let currentIndex = 0;
    
    function updateSlidePosition() {
      const offset = -currentIndex * 100;
      slides.forEach(slide => {
        slide.style.transform = `translateX(${offset}%)`;
      });
    }
    
    function showNextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition();
    }
    
    function showPrevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    }
    
    // Set initial slide position
    updateSlidePosition();
    
    // Attach event listeners to buttons
    nextButton.addEventListener('click', showNextSlide);
    prevButton.addEventListener('click', showPrevSlide);
  }
  

function createDetailPage(article) {
  switchStylesheet('Style-Detail.css');

  // Clear the existing content
  document.body.innerHTML = `
    <div class="detail-page">
      <header class="detail-header">
        <h1>${article.title}</h1>
        <p>${article.author ? `Author: ${article.author}` : 'Author: Unknown'}</p>
        <p>Published on: ${new Date(article.publishedAt).toLocaleDateString()}</p>
      </header>
      <section class="detail-content">
        <img id="article-image" src="${article.urlToImage || 'https://via.placeholder.com/1024?text=No+Image+Available'}" alt="Article Image">
        <div class="detail-text">
          <h2>${article.title}</h2>
          <p>${article.description}</p>
          <p>${article.content}</p>
          <a href="${article.url}" target="_blank" class="external-link">Read Full Article</a>
        </div>
      </section>
      <footer class="detail-footer">
        <button class="back-button">Go Back</button>
      </footer>
    </div>
  `;

  // Add a click event to the "Go Back" button to reload the main page
  document.querySelector('.back-button').addEventListener('click', () => {
    window.location.reload();
  });
}

// Function to switch the stylesheet dynamically
function switchStylesheet(newStylesheet) {
  let currentStylesheet = document.querySelector('link[rel="stylesheet"]');

  if (currentStylesheet) {
    // Update the href attribute to the new stylesheet
    currentStylesheet.href = newStylesheet;
  } else {
    // If no stylesheet is found, create a new one
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = newStylesheet;
    document.head.appendChild(link);
  }
}
