document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.getElementById('main-content');
    const defaultPage = 'dashboard';

    const loadContent = async (url) => {
        try {
            content.classList.add('fade-out');
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
            content.innerHTML = '<p>Error loading page. Check browser console for 404 errors.</p>';
            content.classList.remove('fade-out');
        }
    };

    const navigateToPage = (page) => {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // The path to your modules folder is now also relative.
        loadContent(`modules/${page}.html`);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            
            // SIMPLIFICATION: We won't change the main URL to avoid refresh errors on GitHub Pages.
            // We'll just update the page content.
            navigateToPage(page);
        });
    });

    // We don't need the 'popstate' listener if we aren't changing the history.
    
    // Initial page load
    navigateToPage(defaultPage);
});
