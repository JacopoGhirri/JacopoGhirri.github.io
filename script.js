// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Page navigation
    const links = document.querySelectorAll('nav a');
    const pages = document.querySelectorAll('.page');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');

            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

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
