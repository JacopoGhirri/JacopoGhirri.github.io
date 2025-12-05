document.addEventListener('DOMContentLoaded', () => {
    const pageContent = document.getElementById('pageContent');
    const links = document.querySelectorAll('nav a');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // *** Gallery Configuration: UPDATE THESE VALUES ***
    const GITHUB_USERNAME = 'JacopoGhirri';
    const REPO_NAME = 'jacopoghirri.github.io';
    const PHOTO_FOLDER = 'images/photography';

    // Loads HTML from /pages/*.html when navigating inside the site
    async function loadPage(pageId) {
        try {
            const response = await fetch(`/pages/${pageId}.html`);

            if (!response.ok) {
                throw new Error(`Could not load page: ${pageId}`);
            }

            const content = await response.text();
            pageContent.innerHTML = content;

            // NEW: Check if we are on the 'about' page and load photos/setup arrows
            if (pageId === 'about') {
                loadPhotoGallery();
            }

        } catch (error) {
            console.error('Error loading page:', error);
            pageContent.innerHTML = `<p>Error loading content: ${error.message}</p>`;
        }
    }

    // NEW: Function to load images using the GitHub API
    async function loadPhotoGallery() {
        const gallery = document.getElementById('photoGallery');
        if (!gallery) return;

        const apiUrl = `api.github.com{GITHUB_USERNAME}/${REPO_NAME}/contents/${PHOTO_FOLDER}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }
            const files = await response.json();

            const imageFiles = files.filter(file =>
                file.type === 'file' && /\.(jpg|jpeg|png|gif)$/i.test(file.name)
            );

            imageFiles.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.download_url;
                imgElement.alt = image.name;
                imgElement.classList.add('gallery-photo');
                gallery.appendChild(imgElement);
            });

            // Setup the arrows after images are loaded
            setupGalleryArrows(gallery);

        } catch (error) {
            console.error('Error loading photo gallery:', error);
            gallery.innerHTML = '<p>Could not load photos.</p>';
        }
    }

    // NEW: Function to set up the arrow functionality
    function setupGalleryArrows(galleryContainer) {
        const leftBtn = document.getElementById('scrollLeftBtn');
        const rightBtn = document.getElementById('scrollRightBtn');

        if (!leftBtn || !rightBtn) return;

        leftBtn.addEventListener('click', () => {
            // Adjust scroll value if images are a different size
            galleryContainer.scrollBy({ left: -216, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            // Adjust scroll value if images are a different size
            galleryContainer.scrollBy({ left: 216, behavior: 'smooth' });
        });
    }


    // SPA-like navigation for user clicks (existing code)
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const pageId = link.getAttribute('data-page');
            const href = link.getAttribute('href');

            if (href.startsWith('/')) {
                e.preventDefault();
                loadPage(pageId);
                history.pushState({ page: pageId }, "", href);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Handle back/forward buttons (existing code)
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
        }
    });

    // Initial page load based on URL (existing code, modified slightly)
    const path = window.location.pathname.replace('/', '') || 'home';
    loadPage(path);


    // Dark mode toggle (existing code)
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ Light';
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = '☀️ Light';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeToggle.textContent = '🌙 Dark';
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});
