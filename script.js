document.addEventListener('DOMContentLoaded', () => {

  const contentArea = document.getElementById('content-area');
  const navButtons = document.querySelectorAll('.nav-button');
  const head = document.head;
  let currentModuleStyle = null;

  // Function to dynamically load a module's CSS and HTML
  const loadModule = async (moduleName) => {
    // Clear previous module's styles if they exist
    if (currentModuleStyle) {
      head.removeChild(currentModuleStyle);
      currentModuleStyle = null;
    }

    try {
      // --- DYNAMICALLY LOAD CSS ---
      // Create a new <link> element for the stylesheet
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = `/personalhandbook/styles/${moduleName}.css`;
      
      // Append the new stylesheet to the <head> and keep a reference
      head.appendChild(styleLink);
      currentModuleStyle = styleLink;
      
      // --- FETCH HTML CONTENT ---
      // Use the corrected path for fetching the HTML module
      const response = await fetch(`/personalhandbook/modules/${moduleName}.html`);
      if (!response.ok) {
        throw new Error(`Module '${moduleName}' not found.`);
      }
      
      const htmlContent = await response.text();
      contentArea.innerHTML = htmlContent;

    } catch (error) {
      console.error('Module loading error:', error);
      contentArea.innerHTML = `<p class="error-text">Error loading page. Please try again.</p>`;
    }
  };

  // Add click listeners to navigation buttons
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const moduleName = button.dataset.module;
      loadModule(moduleName);
    });
  });

  // Load the dashboard by default
  loadModule('dashboard'); Ln
});
