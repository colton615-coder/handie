const initSettings = () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (!darkModeToggle) {
        console.error('Settings elements not found. Initialization failed.');
        return;
    }

    // Function to apply the theme based on saved preference
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            // In our case, the app is dark by default.
            // In a real app, you would add a 'dark-mode' class to the body.
            darkModeToggle.checked = true;
        } else {
            // Logic to switch to a light theme would go here.
            darkModeToggle.checked = false;
        }
    };

    // Load the saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    applyTheme(savedTheme);

    // Event listener for the toggle switch
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            localStorage.setItem('theme', 'dark');
            // In a real app, you'd apply dark mode styles here.
        } else {
            localStorage.setItem('theme', 'light');
            alert("Switching to a light theme would happen here!");
        }
    });
};

setTimeout(initSettings, 0);
