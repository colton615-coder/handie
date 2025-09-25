document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.getElementById('main-content');
    const defaultPage = 'dashboard';

    // Function to load content via Fetch API
    const loadContent = async (url) => {
        try {
            content.classList.add('fade-out');
            
            // The fix is in the line below
            const response = await fetch(url); 
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            setTimeout(() => {
                content.innerHTML = data;
                content.classList.remove('fade-out');
                content.classList.add('fade-in');
                setTimeout(() => content.classList.remove('fade-in'), 500);
            }, 300);

        } catch (error) {
            console.error('Fetch error:', error);
            content.innerHTML = '<p class="error-message">Error loading page. Please try again.</p>';
            content.classList.remove('fade-out');
        }
    };

    const navigateToPage = (page) => {
        navLinks.forEach(l => l.classList.remove('active'));
        
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // THIS IS THE CORRECTED LINE: We add the 'modules/' prefix.
        loadContent(`modules/${page}.html`);
    };

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            
            history.pushState({ page }, `${page}`, `/${page}`);
            navigateToPage(page);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        const page = (e.state && e.state.page) ? e.state.page : defaultPage;
        navigateToPage(page);
    });
    
    // Load initial page content
    history.replaceState({ page: defaultPage }, 'Dashboard', `/${defaultPage}`);
    navigateToPage(defaultPage);
});
