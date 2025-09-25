document.addEventListener('DOMContentLoaded', () => {
    // This function will be called when the dashboard content is loaded
    const initializeDashboard = () => {
        const welcomeMessage = document.querySelector('.welcome-message');
        const dateDisplay = document.querySelector('.date-display');
        
        // Update welcome message based on time of day
        const updateWelcomeMessage = () => {
            const hour = new Date().getHours();
            let greeting = 'Good morning, John';
            if (hour >= 12 && hour < 18) {
                greeting = 'Good afternoon, John';
            } else if (hour >= 18) {
                greeting = 'Good evening, John';
            }
            welcomeMessage.textContent = greeting;
        };

        // Update the date display
        const updateDate = () => {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateDisplay.textContent = today.toLocaleDateString('en-US', options);
        };

        if (welcomeMessage && dateDisplay) {
            updateWelcomeMessage();
            updateDate();
        }
    };

    // Use a MutationObserver to re-initialize the dashboard when the content changes
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if(document.querySelector('.dashboard-content')) {
                    initializeDashboard();
                }
            }
        }
    });

    // Start observing the main content container for changes
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        observer.observe(mainContent, { childList: true, subtree: true });
    }
    
    // Initial check in case the dashboard is the first page loaded
    initializeDashboard();
});

