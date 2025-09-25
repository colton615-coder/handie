document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.getElementById('main-content');
    const defaultPage = 'dashboard';

    // Function to load content via Fetch API
    const loadContent = async (url) => {
        try {
            // Add a class to fade out content
            content.classList.add('fade-out');
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            // Wait for the fade-out transition to complete before changing content
            setTimeout(() => {
                content.innerHTML = data;
                // Remove fade-out and add fade-in for a smooth transition
                content.classList.remove('fade-out');
                content.classList.add('fade-in');
                // Remove fade-in class after animation so it can be re-applied
                setTimeout(() => content.classList.remove('fade-in'), 500);
            }, 300); // This duration should match your CSS transition time

        } catch (error) {
            console.error('Fetch error:', error);
            content.innerHTML = '<p>Error loading page. Please try again.</p>';
            content.classList.remove('fade-out');
        }
    };

    const navigateToPage = (page) => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Find and add active class to the correct link
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Load the corresponding HTML file
        loadContent(`${page}.html`);
    };

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            
            // Update the URL in the address bar
            history.pushState({ page }, `${page}`, `/${page}`);
            navigateToPage(page);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        const page = (e.state && e.state.page) ? e.state.page : defaultPage;
        navigateToPage(page);
    });
    
    // Load initial page content (Dashboard) on first visit
    // This logic can be expanded to read the URL path on load
    history.replaceState({ page: defaultPage }, 'Dashboard', `/${defaultPage}`);
    navigateToPage(defaultPage);
});
