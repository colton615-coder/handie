// Wait until the entire HTML document is loaded and ready.
document.addEventListener('DOMContentLoaded', () => {

  const contentArea = document.getElementById('content-area');
  const navButtons = document.querySelectorAll('.nav-button');

  // Function to load a module's content
  const loadModule = async (moduleName) => {
    try {
      // Fetch the HTML content of the module
      const response = await fetch(`modules/${moduleName}.html`);

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to load module: ${moduleName}`);
      }
      
      const htmlContent = await response.text();
      
      // Inject the HTML into the content area
      contentArea.innerHTML = htmlContent;

    } catch (error) {
      console.error('Module loading error:', error);
      contentArea.innerHTML = `<p class="error-text">Could not load the ${moduleName} module. Please try again later.</p>`;
    }
  };

  // Add a click event listener to each navigation button
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const moduleName = button.dataset.module;
      loadModule(moduleName);
    });
  });

  // Load the dashboard by default when the application starts
  loadModule('dashboard'); 
});
