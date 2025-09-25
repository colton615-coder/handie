// Using a self-invoking function to avoid polluting the global scope
(() => {
    // This will hold our tasks array
    let tasks = [];

    // Function to save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('handbook_tasks', JSON.stringify(tasks));
    };

    // Function to load tasks from localStorage
    const loadTasks = () => {
        const storedTasks = localStorage.getItem('handbook_tasks');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
    };

    // Function to render tasks to the DOM
    const renderTasks = (filter = 'all') => {
        const taskListContainer = document.getElementById('tasks-list-container');
        if (!taskListContainer) return;

        // Clear the current list
        taskListContainer.innerHTML = '';

        const today = new Date().toISOString().slice(0, 10);

        const filteredTasks = tasks.filter(task => {
            if (filter === 'today') return task.dueDate === today && !task.done;
            if (filter === 'high-priority') return task.priority === 'high' && !task.done;
            return true; // 'all' filter
        });

        if (filteredTasks.length === 0) {
            taskListContainer.innerHTML = '<p class="no-tasks-message">No tasks found for this filter.</p>';
            return;
        }

        filteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item', `priority-${task.priority}`, task.done ? 'done' : '');
            taskElement.setAttribute('data-index', index);

            taskElement.innerHTML = `
                <div class="task-info">
                    <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
                    <div class="task-details">
                        <p class="task-title">${task.title}</p>
                        ${task.notes ? `<p class="task-notes">${task.notes}</p>` : ''}
                        ${task.dueDate ? `<p class="task-due-date">Due: ${task.dueDate}</p>` : ''}
                    </div>
                </div>
                <button class="task-delete-btn"><i class="fas fa-trash-alt"></i></button>
            `;
            taskListContainer.appendChild(taskElement);
        });
    };

    // Main initialization function for the tasks page
    const initializeTasks = () => {
        const addTaskBtn = document.getElementById('add-task-btn');
        const taskModal = document.getElementById('task-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const taskForm = document.getElementById('task-form');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Event listener for opening the modal
        addTaskBtn?.addEventListener('click', () => {
            taskModal.style.display = 'flex';
        });

        // Event listener for closing the modal
        const closeModal = () => {
            taskModal.style.display = 'none';
            taskForm.reset();
        };
        closeModalBtn?.addEventListener('click', closeModal);
        taskModal?.addEventListener('click', (e) => {
            if (e.target === taskModal) closeModal();
        });

        // Event listener for form submission
        taskForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTask = {
                title: document.getElementById('task-title').value,
                notes: document.getElementById('task-notes').value,
                dueDate: document.getElementById('task-due-date').value,
                priority: document.getElementById('task-priority').value,
                done: false
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            closeModal();
        });
        
        // Event listeners for task actions (completion and deletion)
        document.getElementById('tasks-list-container')?.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const index = parseInt(taskItem.getAttribute('data-index'), 10);
            
            // Handle task completion
            if (e.target.classList.contains('task-checkbox')) {
                tasks[index].done = !tasks[index].done;
                saveTasks();
                renderTasks(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
            }
            
            // Handle task deletion
            if (e.target.closest('.task-delete-btn')) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
            }
        });
        
        // Event listeners for filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTasks(btn.dataset.filter);
            });
        });

        // Initial load and render
        loadTasks();
        renderTasks();
    };
    
    // --- Observer to re-initialize when content is loaded ---
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && document.querySelector('.tasks-content')) {
                initializeTasks();
                // We can disconnect after initializing to avoid re-running on every small change
                // observer.disconnect();
            }
        }
    });

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        observer.observe(mainContent, { childList: true, subtree: true });
    }
})();
