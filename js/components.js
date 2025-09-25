// Create a global namespace for our app components
window.App = window.App || {};

App.ModalManager = (function() {
    
    /**
     * Initializes a modal component.
     * @param {object} options - The configuration for the modal.
     * @param {string} options.modalId - The ID of the modal overlay element.
     * @param {string} options.openBtnId - The ID of the button that opens the modal.
     * @param {string} options.closeBtnId - The ID of the button that closes the modal.
     * @param {string} options.formId - The ID of the form inside the modal.
     * @param {function} options.onFormSubmit - A callback function executed on form submission. It receives the form data as an object.
     */
    function initialize(options) {
        const modal = document.getElementById(options.modalId);
        const openBtn = document.getElementById(options.openBtnId);
        const closeBtn = document.getElementById(options.closeBtnId);
        const form = document.getElementById(options.formId);

        if (!modal || !openBtn || !closeBtn || !form) {
            // console.warn(`Modal component with ID ${options.modalId} is missing one or more required elements.`);
            return;
        }

        const openModal = () => {
            modal.style.display = 'flex';
        };

        const closeModal = () => {
            modal.style.display = 'none';
            form.reset();
        };

        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            if (options.onFormSubmit) {
                options.onFormSubmit(data);
            }
            
            closeModal();
        });
    }

    // Expose the initialize function to the public API
    return {
        initialize: initialize
    };

})();

