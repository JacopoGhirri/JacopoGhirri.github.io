document.addEventListener('DOMContentLoaded', () => {
    // Page navigation and content loading
    const links = document.querySelectorAll('nav a');
    const pages = document.querySelectorAll('.page');

    // Function to load page content
    async function loadPageContent(pageId) {
        try {
            const response = await fetch(`pages/${pageId}.html`);
            if (!response.ok) {
                throw new Error(`Could not load page: ${pageId}`);
            }
            const content = await response.text();
            const pageElement = document.getElementById(pageId);
            pageElement.innerHTML = content;
        } catch (error) {
            console.error('Error loading page:', error);
            const pageElement = document.getElementById(pageId);
            pageElement.innerHTML = `<p>Error loading content: ${error.message}</p>`;
        }
    }

    // Track loaded pages to avoid re-fetching
    const loadedPages = new Set();

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');

            // Remove active class from all pages
            pages.forEach(page => page.classList.remove('active'));

            // Add active class to selected page
            const currentPage = document.getElementById(pageId);
            currentPage.classList.add('active');

            // Load page content if not already loaded
            if (!loadedPages.has(pageId)) {
                loadPageContent(pageId);
                loadedPages.add(pageId);
            }

            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Load home page content initially
    loadPageContent('home');
    loadedPages.add('home');

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved dark mode preference
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
