(() => {
    let goals = [];
    let habits = [];

    // --- Data Persistence ---
    const saveData = () => {
        localStorage.setItem('handbook_goals', JSON.stringify(goals));
        localStorage.setItem('handbook_habits', JSON.stringify(habits));
    };

    const loadData = () => {
        const storedGoals = localStorage.getItem('handbook_goals');
        goals = storedGoals ? JSON.parse(storedGoals) : [];
        const storedHabits = localStorage.getItem('handbook_habits');
        habits = storedHabits ? JSON.parse(storedHabits) : [];
    };

    // --- Rendering Functions ---
    const renderGoals = () => {
        const goalsList = document.getElementById('goals-list');
        if (!goalsList) return;
        goalsList.innerHTML = '';
        goals.forEach((goal, index) => {
            const goalItem = document.createElement('div');
            goalItem.className = 'card goal-item';
            goalItem.dataset.index = index;
            goalItem.innerHTML = `
                <h3 class="goal-name">${goal.name}</h3>
                ${goal.description ? `<p class="goal-meta">${goal.description}</p>` : ''}
                <div class="progress-bar-container" title="Click to update progress">
                    <div class="progress-bar" style="width: ${goal.progress}%;"></div>
                </div>
                <span class="progress-text">${goal.progress}% Complete</span>
            `;
            goalsList.appendChild(goalItem);
        });
    };

    const renderHabits = () => {
        const habitsGrid = document.getElementById('habits-grid');
        if (!habitsGrid) return;
        habitsGrid.innerHTML = '';
        const today = new Date().toISOString().slice(0, 10);

        habits.forEach((habit, index) => {
            const isCompleted = habit.lastCompleted === today;
            const habitItem = document.createElement('div');
            habitItem.className = 'habit-item';
            habitItem.dataset.index = index;
            habitItem.innerHTML = `
                <input type="checkbox" id="habit-${index}" class="habit-checkbox" ${isCompleted ? 'checked' : ''}>
                <label for="habit-${index}" class="habit-label">${habit.name}</label>
            `;
            habitsGrid.appendChild(habitItem);
        });
    };

    // --- Main Initialization ---
    const initializeGoalsAndHabits = () => {
        // Handle showing/hiding progress input based on type selection
        const goalTypeSelector = document.getElementById('goal-type');
        const progressContainer = document.getElementById('goal-progress-container');
        goalTypeSelector?.addEventListener('change', () => {
            progressContainer.style.display = goalTypeSelector.value === 'goal' ? 'block' : 'none';
        });

        // Initialize the modal
        App.ModalManager.initialize({
            modalId: 'goal-modal',
            openBtnId: 'add-goal-btn',
            closeBtnId: 'close-goal-modal-btn',
            formId: 'goal-form',
            onFormSubmit: (data) => {
                if (data['goal-type'] === 'habit') {
                    habits.push({
                        name: data['goal-name'],
                        lastCompleted: null
                    });
                    renderHabits();
                } else {
                    goals.push({
                        name: data['goal-name'],
                        description: data['goal-description'],
                        progress: parseInt(data['goal-progress'], 10) || 0
                    });
                    renderGoals();
                }
                saveData();
            }
        });

        // Event delegation for habit checkboxes
        document.getElementById('habits-grid')?.addEventListener('change', (e) => {
            if (e.target.classList.contains('habit-checkbox')) {
                const index = e.target.closest('.habit-item').dataset.index;
                const today = new Date().toISOString().slice(0, 10);
                habits[index].lastCompleted = e.target.checked ? today : null;
                saveData();
            }
        });

        // Event delegation for updating goal progress
        document.getElementById('goals-list')?.addEventListener('click', (e) => {
            const progressBar = e.target.closest('.progress-bar-container');
            if (progressBar) {
                const index = progressBar.closest('.goal-item').dataset.index;
                const currentProgress = goals[index].progress;
                const newProgress = prompt('Update progress percentage:', currentProgress);
                
                if (newProgress !== null && !isNaN(newProgress)) {
                    goals[index].progress = Math.max(0, Math.min(100, parseInt(newProgress, 10)));
                    saveData();
                    renderGoals();
                }
            }
        });
        
        loadData();
        renderGoals();
        renderHabits();
    };

    // --- Observer ---
    const observer = new MutationObserver((mutationsList) => {
        if (mutationsList.some(m => m.type === 'childList' && document.querySelector('.goals-content'))) {
            initializeGoalsAndHabits();
        }
    });
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
})();
