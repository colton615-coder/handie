document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.getElementById('main-content');

    // Function to load content for a specific module
    const loadModule = async (moduleName) => {
        try {
            const response = await fetch(`modules/${moduleName}.html`);
            if (!response.ok) {
                throw new Error(`Could not load module: ${moduleName}`);
            }
            const html = await response.text();
            mainContent.innerHTML = html;
        } catch (error) {
            console.error(error);
            mainContent.innerHTML = '<p style="color: red;">Error loading content. Please try again later.</p>';
        }
    };

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleName = item.dataset.module;

            // Update active class
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Load the new module
            loadModule(moduleName);
        });
    });

    // Load the dashboard by default on page load
    loadModule('dashboard');
});
