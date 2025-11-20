document.addEventListener('DOMContentLoaded', () => {
    const pageContent = document.getElementById('pageContent');
    const links = document.querySelectorAll('nav a');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Function to load page content
    async function loadPage(pageId) {
        try {
            const response = await fetch(`pages/${pageId}.html`);

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

    // Navigation event listeners
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            loadPage(pageId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Initial page load (Home)
    loadPage('home');

    // Dark mode toggle logic
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
