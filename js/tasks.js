(() => {
    let tasks = [];

    const saveTasks = () => localStorage.setItem('handbook_tasks', JSON.stringify(tasks));
    const loadTasks = () => {
        const storedTasks = localStorage.getItem('handbook_tasks');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
    };

    const renderTasks = (filter = 'all') => {
        const taskListContainer = document.getElementById('tasks-list-container');
        if (!taskListContainer) return;

        taskListContainer.innerHTML = '';
        const today = new Date().toISOString().slice(0, 10);

        const filteredTasks = tasks.filter(task => {
            if (filter === 'today') return task.dueDate === today && !task.done;
            if (filter === 'high-priority') return task.priority === 'high' && !task.done;
            return true;
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

    const initializeTasks = () => {
        // Initialize the modal using the new component
        App.ModalManager.initialize({
            modalId: 'task-modal',
            openBtnId: 'add-task-btn',
            closeBtnId: 'close-modal-btn',
            formId: 'task-form',
            onFormSubmit: (data) => {
                const newTask = {
                    title: data['task-title'],
                    notes: data['task-notes'],
                    dueDate: data['task-due-date'],
                    priority: data['task-priority'],
                    done: false
                };
                tasks.push(newTask);
                saveTasks();
                renderTasks();
            }
        });

        document.getElementById('tasks-list-container')?.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            const index = parseInt(taskItem.getAttribute('data-index'), 10);
            if (e.target.classList.contains('task-checkbox')) {
                tasks[index].done = !tasks[index].done;
                saveTasks();
                renderTasks(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
            }
            if (e.target.closest('.task-delete-btn')) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
            }
        });
        
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTasks(btn.dataset.filter);
            });
        });

        loadTasks();
        renderTasks();
    };
    
    const observer = new MutationObserver((mutationsList) => {
        if (mutationsList.some(m => m.type === 'childList' && document.querySelector('.tasks-content'))) {
            initializeTasks();
        }
    });
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
})();
