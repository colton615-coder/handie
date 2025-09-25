document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.getElementById('main-content');

    // Function to load content via Fetch API
    const loadContent = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            content.innerHTML = data;
        } catch (error) {
            console.error('Fetch error:', error);
            content.innerHTML = '<p>Error loading page. Please try again.</p>';
        }
    };

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to the clicked link
            e.currentTarget.classList.add('active');

            // Load the corresponding HTML file
            loadContent(`${page}.html`);

            // Update the URL in the address bar
            history.pushState({ page }, `${page}`, `/${page}`);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state) {
            navLinks.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[data-page="${e.state.page}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            loadContent(`${e.state.page}.html`);
        }
    });
    
    // Load initial page content (Dashboard)
    loadContent('dashboard.html');
});
