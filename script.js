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

            // If the CV page was loaded, render the timeline from JSON
            if (pageId === 'cv') {
                renderCV();
            }
        } catch (error) {
            console.error('Error loading page:', error);
            pageContent.innerHTML = `<p>Error loading content: ${error.message}</p>`;
        }
    }

    // CV rendering logic
    async function renderCV() {
        try {
            const resp = await fetch('/data/cv.json');
            if (!resp.ok) throw new Error('Could not load CV data');
            const data = await resp.json();

            function formatDate(dateStr) {
                if (!dateStr) return 'Present';
                const [y, m] = dateStr.split('-');
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return months[parseInt(m, 10) - 1] + ' ' + y;
            }

            function parseDate(dateStr) {
                if (!dateStr) return new Date(9999, 0);
                const [y, m] = dateStr.split('-');
                return new Date(parseInt(y), parseInt(m) - 1);
            }

            function overlaps(a, b) {
                const aStart = parseDate(a.start);
                const aEnd = a.end ? parseDate(a.end) : new Date();
                const bStart = parseDate(b.start);
                const bEnd = b.end ? parseDate(b.end) : new Date();
                return aStart <= bEnd && bStart <= aEnd;
            }

            function buildTimeline(entries) {
                const sorted = [...entries].sort((a, b) => {
                    const aOngoing = !a.end;
                    const bOngoing = !b.end;
                    if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;
                    return parseDate(b.start) - parseDate(a.start);
                });

                const groups = [];
                for (const entry of sorted) {
                    const lastGroup = groups[groups.length - 1];
                    if (lastGroup) {
                        const primary = lastGroup[0];
                        if (!primary.end && overlaps(primary, entry) && entry.end) {
                            lastGroup.push(entry);
                            continue;
                        }
                    }
                    groups.push([entry]);
                }
                return groups;
            }

            function renderSection(containerId, title, entries) {
                const container = document.getElementById(containerId);
                if (!container) return;
                const groups = buildTimeline(entries);

                let html = '<h2>' + title + '</h2>';
                html += '<div class="timeline">';

                groups.forEach(function (group) {
                    const primary = group[0];
                    const isCurrent = !primary.end;

                    html += '<div class="timeline-item">';
                    html += '<div class="timeline-icon"></div>';
                    html += '<div class="timeline-content">';

                    html += '<div class="timeline-date' + (isCurrent ? ' current' : '') + '">';
                    html += formatDate(primary.start) + ' – ' + formatDate(primary.end);
                    html += '</div>';
                    html += '<div class="timeline-position">';
                    html += '<div class="timeline-title">' + primary.title + '</div>';
                    html += '<div class="timeline-subtitle">' + primary.institution + '</div>';
                    html += '<div class="timeline-location">' + primary.location + '</div>';
                    if (primary.description) {
                        html += '<div class="timeline-description">' + primary.description + '</div>';
                    }
                    html += '</div>';

                    for (var i = 1; i < group.length; i++) {
                        var c = group[i];
                        html += '<div class="timeline-position concurrent">';
                        html += '<div class="concurrent-badge">Concurrent</div>';
                        html += '<div class="timeline-date-inline">' + formatDate(c.start) + ' – ' + formatDate(c.end) + '</div>';
                        html += '<div class="timeline-title">' + c.title + '</div>';
                        html += '<div class="timeline-subtitle">' + c.institution + '</div>';
                        html += '<div class="timeline-location">' + c.location + '</div>';
                        if (c.description) {
                            html += '<div class="timeline-description">' + c.description + '</div>';
                        }
                        html += '</div>';
                    }

                    html += '</div></div>';
                });

                html += '</div>';
                container.innerHTML = html;
            }

            renderSection('cv-experience', 'Work Experience', data.experience);
            renderSection('cv-education', 'Education', data.education);

        } catch (error) {
            console.error('Error rendering CV:', error);
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