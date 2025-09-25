document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.getElementById('main-content');
    const defaultPage = 'dashboard';

    const loadContent = async (url) => {
        try {
            content.classList.add('fade-out');
            // This now works because of the <base> tag in index.html
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
            content.innerHTML = '<p>Error loading page. Please check the browser console for details.</p>';
            content.classList.remove('fade-out');
        }
    };

    const navigateToPage = (page) => {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // This path is now correct because of the <base> tag.
        loadContent(`modules/${page}.html`);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Initial page load
    navigateToPage(defaultPage);
});
