document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('main-content');
    const navItems = document.querySelectorAll('.nav-item');

    const moduleData = {
        'dashboard': {
            url: 'modules/dashboard.html',
            init: initDashboard
        },
        'calendar': {
            url: 'modules/calendar.html',
            init: initCalendar
        },
        'tasks': {
            url: 'modules/tasks.html',
            init: initTasks
        },
        'goals': {
            url: 'modules/goals.html',
            init: initGoals
        },
        'journal': {
            url: 'modules/journal.html',
            init: initJournal
        },
        'wellness': {
            url: 'modules/wellness.html',
            init: initWellness
        }
    };

    // Main function to load and initialize a module
    const loadModule = async (moduleName, action = null) => {
        try {
            const response = await fetch(moduleData[moduleName].url);
            if (!response.ok) {
                throw new Error(`Could not load module: ${moduleName}`);
            }
            const html = await response.text();
            mainContent.innerHTML = html;

            if (moduleData[moduleName].init) {
                moduleData[moduleName].init(action);
            }

        } catch (error) {
            console.error('Failed to load module:', error);
            mainContent.innerHTML = '<div class="error-message card">Error loading content. Please try again later.</div>';
        }
    };

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleName = item.dataset.module;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            loadModule(moduleName);
        });
    });

    // Load the Dashboard by default on page load
    loadModule('dashboard');

    // --- Module Initialization Functions ---

    // Dashboard Module
    function initDashboard() {
        // Set the current date
        const dateDisplay = document.querySelector('.date-display');
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = today.toLocaleDateString('en-US', options);

        // Placeholder for user-specific data (will be dynamic later)
        const welcomeMessage = document.querySelector('.welcome-message');
        const userName = "John";
        const currentTime = new Date().getHours();
        let greeting;
        if (currentTime < 12) {
            greeting = 'Good morning';
        } else if (currentTime < 18) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }
        welcomeMessage.textContent = `${greeting}, ${userName}`;

        // Add event listeners for quick actions
        document.querySelector('.quick-action-grid').addEventListener('click', (e) => {
            const btn = e.target.closest('.action-btn');
            if (btn) {
                const action = btn.dataset.action;
                if (action === 'add-task') {
                    document.querySelector('[data-module="tasks"]').click();
                    // We'll add logic to auto-open the modal in initTasks later
                } else if (action === 'log-workout') {
                    document.querySelector('[data-module="wellness"]').click();
                    // We'll add logic to open workout tracker in initWellness later
                } else if (action === 'new-journal') {
                    document.querySelector('[data-module="journal"]').click();
                    // We'll add logic to auto-open the modal in initJournal later
                } else if (action === 'track-golf') {
                    document.querySelector('[data-module="wellness"]').click();
                    // We'll add logic to auto-open the golf tracker in initWellness later
                }
            }
        });
    }

    // Calendar Module
    function initCalendar() {
        const calendarDaysGrid = document.getElementById('calendar-days-grid');
        const currentMonthYear = document.getElementById('current-month-year');
        const plannerDateTitle = document.getElementById('planner-date-title');
        const dailyPlannerList = document.getElementById('daily-planner-list');
        const prevMonthBtn = document.querySelector('.prev-month');
        const nextMonthBtn = document.querySelector('.next-month');

        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        // No mock data, just a placeholder for now
        let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

        const generateCalendar = (month, year) => {
            calendarDaysGrid.innerHTML = '';
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const totalDays = lastDay.getDate();

            currentMonthYear.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

            for (let i = 0; i < firstDay.getDay(); i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'day-cell empty-cell';
                calendarDaysGrid.appendChild(emptyCell);
            }

            for (let day = 1; day <= totalDays; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                dayCell.textContent = day;

                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (events[dateString]) {
                    dayCell.classList.add('has-events');
                }

                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayCell.classList.add('current-day');
                }

                dayCell.addEventListener('click', () => {
                    selectDate(new Date(year, month, day));
                });

                calendarDaysGrid.appendChild(dayCell);
            }
        };

        const selectDate = (date) => {
            plannerDateTitle.textContent = `Events for ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`;

            dailyPlannerList.innerHTML = '';
            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const dayEvents = events[dateString];

            if (dayEvents && dayEvents.length > 0) {
                dayEvents.forEach(event => {
                    const eventCard = document.createElement('li');
                    eventCard.className = 'planner-event-card';
                    eventCard.style.borderLeftColor = event.color;
                    eventCard.innerHTML = `
                        <span class="event-time-block">${event.time}</span>
                        <span class="event-title">${event.title}</span>
                    `;
                    dailyPlannerList.appendChild(eventCard);
                });
            } else {
                dailyPlannerList.innerHTML = '<li style="color: rgba(255,255,255,0.7);">No events scheduled.</li>';
            }
        };

        generateCalendar(currentMonth, currentYear);
        selectDate(today);

        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }

    // Tasks Module
    function initTasks() {
        const taskListContainer = document.getElementById('tasks-list-container');
        const addTaskBtn = document.getElementById('add-task-btn');
        const taskModal = document.getElementById('task-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const taskForm = document.getElementById('task-form');
        const filterButtons = document.querySelectorAll('.filter-btn');

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        const saveTasks = () => {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        };

        const renderTasks = (filter = 'all') => {
            taskListContainer.innerHTML = '';
            let filteredTasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

            if (filter === 'today') {
                const todayDate = new Date().toISOString().split('T')[0];
                filteredTasks = filteredTasks.filter(task => task.dueDate === todayDate && !task.completed);
            } else if (filter === 'high-priority') {
                filteredTasks = filteredTasks.filter(task => task.priority === 'high' && !task.completed);
            }

            if (filteredTasks.length === 0) {
                taskListContainer.innerHTML = '<p class="placeholder-text card">No tasks found for this view.</p>';
                return;
            }

            filteredTasks.forEach(task => {
                const taskCard = document.createElement('div');
                taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;
                taskCard.innerHTML = `
                    <div class="task-checkbox ${task.completed ? 'completed' : ''}" data-id="${task.id}"></div>
                    <div class="task-details">
                        <p class="task-title">${task.title}</p>
                        <div class="task-meta">
                            <span>Due: ${task.dueDate}</span>
                            <span class="priority-tag priority-${task.priority}">${task.priority}</span>
                        </div>
                    </div>
                `;
                taskListContainer.appendChild(taskCard);

                taskCard.querySelector('.task-checkbox').addEventListener('click', (e) => {
                    const taskId = parseInt(e.target.dataset.id);
                    const taskIndex = tasks.findIndex(t => t.id === taskId);
                    if (taskIndex !== -1) {
                        tasks[taskIndex].completed = !tasks[taskIndex].completed;
                        saveTasks();
                        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
                    }
                });
            });
        };

        const showModal = () => {
            taskModal.classList.add('active');
        };

        const hideModal = () => {
            taskModal.classList.remove('active');
            taskForm.reset();
        };

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTask = {
                id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                title: document.getElementById('task-title').value,
                notes: document.getElementById('task-notes').value,
                dueDate: document.getElementById('task-due-date').value,
                priority: document.getElementById('task-priority').value,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            hideModal();
            renderTasks('all');
        });

        addTaskBtn.addEventListener('click', showModal);
        closeModalBtn.addEventListener('click', hideModal);
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) {
                hideModal();
            }
        });

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(f => f.classList.remove('active'));
                btn.classList.add('active');
                renderTasks(btn.dataset.filter);
            });
        });

        renderTasks('all');
    }

    // Goals Module
    function initGoals() {
        const goalsList = document.getElementById('goals-list');
        const habitsGrid = document.getElementById('habits-grid');
        const addGoalBtn = document.getElementById('add-goal-btn');
        const goalModal = document.getElementById('goal-modal');
        const closeGoalModalBtn = document.getElementById('close-goal-modal-btn');
        const goalForm = document.getElementById('goal-form');

        let habits = JSON.parse(localStorage.getItem('habits')) || [];
        let goals = JSON.parse(localStorage.getItem('goals')) || [];

        const saveHabits = () => {
            localStorage.setItem('habits', JSON.stringify(habits));
        };

        const saveGoals = () => {
            localStorage.setItem('goals', JSON.stringify(goals));
        };

        const renderHabits = () => {
            habitsGrid.innerHTML = '';
            if (habits.length === 0) {
                habitsGrid.innerHTML = '<p class="placeholder-text">No habits to track. Add one below!</p>';
            }
            habits.forEach(habit => {
                const habitItem = document.createElement('div');
                habitItem.className = `habit-item card ${habit.completedToday ? 'completed' : ''}`;
                habitItem.innerHTML = `
                    <i class="${habit.icon} habit-icon" style="color: ${habit.color}"></i>
                    <span class="habit-name">${habit.name}</span>
                    <span class="habit-streak">${habit.streak} days</span>
                `;
                habitsGrid.appendChild(habitItem);

                habitItem.addEventListener('click', () => {
                    const newStatus = !habit.completedToday;
                    habit.completedToday = newStatus;
                    habit.streak = newStatus ? habit.streak + 1 : habit.streak - 1;
                    saveHabits();
                    renderHabits();
                });
            });
        };

        const renderGoals = () => {
            goalsList.innerHTML = '';
            if (goals.length === 0) {
                goalsList.innerHTML = '<p class="placeholder-text card">No goals yet. Set your sights high!</p>';
            }
            goals.forEach(goal => {
                const goalItem = document.createElement('div');
                goalItem.className = 'goal-item card';
                goalItem.innerHTML = `
                    <h3 class="goal-name">${goal.name}</h3>
                    <p class="goal-meta">${goal.description}</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${goal.progress}%;"></div>
                    </div>
                    <span class="progress-text">${goal.progress}% Complete</span>
                `;
                goalsList.appendChild(goalItem);
            });
        };

        const showModal = () => {
            goalModal.classList.add('active');
        };

        const hideModal = () => {
            goalModal.classList.remove('active');
            goalForm.reset();
        };

        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('goal-name').value;
            const description = document.getElementById('goal-description').value;

            goals.push({
                id: goals.length ? Math.max(...goals.map(g => g.id)) + 1 : 1,
                name: name,
                description: description,
                progress: 0
            });
            saveGoals();
            hideModal();
            renderGoals();
        });

        addGoalBtn.addEventListener('click', showModal);
        closeGoalModalBtn.addEventListener('click', hideModal);
        goalModal.addEventListener('click', (e) => {
            if (e.target === goalModal) {
                hideModal();
            }
        });

        renderHabits();
        renderGoals();
    }

    // Journal Module
    function initJournal() {
        const journalList = document.getElementById('journal-list');
        const addJournalBtn = document.getElementById('add-journal-btn');
        const journalModal = document.getElementById('journal-modal');
        const closeJournalModalBtn = document.getElementById('close-journal-modal-btn');
        const journalForm = document.getElementById('journal-form');

        let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];

        const saveJournalEntries = () => {
            localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
        };

        const renderJournal = () => {
            journalList.innerHTML = '';
            if (journalEntries.length === 0) {
                journalList.innerHTML = '<p class="placeholder-text card">Start your journal. Write your first entry!</p>';
            }
            journalEntries.forEach(entry => {
                const entryCard = document.createElement('div');
                entryCard.className = 'card journal-entry-card';
                entryCard.innerHTML = `
                    <h3 class="entry-title">${entry.title}</h3>
                    <p class="entry-date">${entry.date}</p>
                    <p class="entry-preview">${entry.body.substring(0, 100)}...</p>
                `;
                journalList.appendChild(entryCard);
            });
        };

        const showModal = () => {
            journalModal.classList.add('active');
        };

        const hideModal = () => {
            journalModal.classList.remove('active');
            journalForm.reset();
        };

        journalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('journal-title').value;
            const body = document.getElementById('journal-body').value;

            const newEntry = {
                id: journalEntries.length ? Math.max(...journalEntries.map(e => e.id)) + 1 : 1,
                title: title,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                body: body
            };

            journalEntries.unshift(newEntry);
            saveJournalEntries();
            hideModal();
            renderJournal();
        });

        addJournalBtn.addEventListener('click', showModal);
        closeJournalModalBtn.addEventListener('click', hideModal);
        journalModal.addEventListener('click', (e) => {
            if (e.target === journalModal) {
                hideModal();
            }
        });

        renderJournal();
    }

    // Wellness Module
    function initWellness() {
        const trackerGrid = document.querySelector('.tracker-grid');
        const wellnessDetailView = document.getElementById('wellness-detail-view');

        const saveWellnessData = (key, data) => {
            localStorage.setItem(key, JSON.stringify(data));
        };

        const loadWellnessData = (key) => {
            return JSON.parse(localStorage.getItem(key)) || [];
        };

        const renderGolfTracker = () => {
            const golfData = loadWellnessData('golfData');
            wellnessDetailView.innerHTML = `
                <h2 class="card-title">Golf Tracker</h2>
                <div class="tracker-actions">
                    <button class="btn add-round-btn">Add New Round</button>
                </div>
                <div id="golf-rounds-list"></div>
            `;
            wellnessDetailView.style.display = 'block';

            const roundsListContainer = document.getElementById('golf-rounds-list');
            const renderRounds = () => {
                roundsListContainer.innerHTML = '';
                if (golfData.length === 0) {
                    roundsListContainer.innerHTML = '<p class="placeholder-text card">No rounds logged yet.</p>';
                } else {
                    golfData.forEach(round => {
                        const roundCard = document.createElement('div');
                        roundCard.className = 'card golf-round-card';
                        roundCard.innerHTML = `
                            <p class="round-date">${round.date}</p>
                            <p class="round-score">Score: <strong>${round.score}</strong></p>
                        `;
                        roundsListContainer.appendChild(roundCard);
                    });
                }
            };
            
            document.querySelector('.add-round-btn').addEventListener('click', () => {
                const score = prompt('Enter your score for the round:');
                if (score) {
                    const newRound = {
                        date: new Date().toLocaleDateString(),
                        score: parseInt(score)
                    };
                    golfData.unshift(newRound);
                    saveWellnessData('golfData', golfData);
                    renderRounds();
                }
            });

            renderRounds();
        };

        const renderWorkoutTracker = () => {
            wellnessDetailView.innerHTML = `
                <h2 class="card-title">Workout Tracker</h2>
                <p class="placeholder-text card">This is where your workout logs and progress will be shown.</p>
                <button class="btn add-workout-btn">Log a Workout</button>
            `;
            wellnessDetailView.style.display = 'block';
        };

        const renderNutritionTracker = () => {
            wellnessDetailView.innerHTML = `
                <h2 class="card-title">Nutrition Tracker</h2>
                <p class="placeholder-text card">This is where you'll track your meals and hydration.</p>
                <button class="btn add-nutrition-btn">Log a Meal</button>
            `;
            wellnessDetailView.style.display = 'block';
        };

        trackerGrid.addEventListener('click', (e) => {
            const targetCard = e.target.closest('.tracker-card');
            if (targetCard) {
                const trackerType = targetCard.dataset.tracker;
                if (trackerType === 'golf') {
                    renderGolfTracker();
                } else if (trackerType === 'workout') {
                    renderWorkoutTracker();
                } else if (trackerType === 'nutrition') {
                    renderNutritionTracker();
                }
            }
        });
    }
});
