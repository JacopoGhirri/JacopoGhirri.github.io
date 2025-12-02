document.addEventListener('DOMContentLoaded', () => {
    const pageContent = document.getElementById('pageContent');
    const links = document.querySelectorAll('nav a');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Loads HTML from /pages/*.html when navigating inside the site
    async function loadPage(pageId) {
        try {
            const response = await fetch(`/pages/${pageId}.html`);

            if (!response.ok) {
                throw new Error(`Could not load page: ${pageId}`);
            }

            const content = await response.text();
            pageContent.innerHTML = content;
        } catch (error) {
            console.error('Error loading page:', error);
            pageContent.innerHTML = `<p>Error loading content: ${error.message}</p>`;
        }
    }

    // SPA-like navigation for user clicks
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const pageId = link.getAttribute('data-page');
            const href = link.getAttribute('href');

            // Only intercept links that stay inside the site
            if (href.startsWith('/')) {
                e.preventDefault();
                loadPage(pageId);

                // Update browser URL without reload
                history.pushState({ page: pageId }, "", href);

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Handle back/forward buttons
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
        }
    });

    // Initial page load based on URL
    const path = window.location.pathname.replace('/', '') || 'home';
    loadPage(path);

    // Dark mode toggle
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
