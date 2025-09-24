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
    const loadModule = async (moduleName) => {
        try {
            const response = await fetch(moduleData[moduleName].url);
            if (!response.ok) {
                throw new Error(`Could not load module: ${moduleName}`);
            }
            const html = await response.text();
            mainContent.innerHTML = html;

            // Call the initialization function for the loaded module
            if (moduleData[moduleName].init) {
                moduleData[moduleName].init();
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
        const userName = "John"; // This can be set dynamically
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

        // Mock event data
        const mockEvents = {
            '2025-09-24': [{
                time: '10:00 AM',
                title: 'Team Stand-up',
                color: '#3498db'
            }, {
                time: '2:30 PM',
                title: 'Dentist Appointment',
                color: '#e74c3c'
            }],
            '2025-09-27': [{
                time: '9:00 AM',
                title: 'Gym Session',
                color: '#2ecc71'
            }]
        };

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
                if (mockEvents[dateString]) {
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
            const events = mockEvents[dateString];

            if (events && events.length > 0) {
                events.forEach(event => {
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

        // Initial generation and selection
        generateCalendar(currentMonth, currentYear);
        selectDate(today);

        // Event listeners for month navigation
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

                // Add event listener to the checkbox
                taskCard.querySelector('.task-checkbox').addEventListener('click', (e) => {
                    const taskId = parseInt(e.target.dataset.id);
                    const taskIndex = tasks.findIndex(t => t.id === taskId);
                    if (taskIndex !== -1) {
                        tasks[taskIndex].completed = !tasks[taskIndex].completed;
                        saveTasks();
                        renderTasks(document.querySelector('.filter-btn.active').dataset.filter); // Re-render with current filter
                    }
                });
            });
        };

        // Show the modal
        const showModal = () => {
            taskModal.classList.add('active');
        };

        // Hide the modal
        const hideModal = () => {
            taskModal.classList.remove('active');
            taskForm.reset();
        };

        // Handle form submission
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

        // Event listeners
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

        // Initial render
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

        // Mock data
        let habits = [{
            id: 1,
            name: 'Meditate',
            icon: 'fas fa-brain',
            color: '#2ecc71',
            streak: 5,
            completedToday: true
        }, {
            id: 2,
            name: 'Workout',
            icon: 'fas fa-dumbbell',
            color: '#e74c3c',
            streak: 3,
            completedToday: false
        }, {
            id: 3,
            name: 'Read',
            icon: 'fas fa-book',
            color: '#3498db',
            streak: 12,
            completedToday: false
        }];

        let goals = [{
            id: 1,
            name: 'Learn a New Language',
            description: 'Daily: Duolingo, Practice Speaking',
            progress: 45
        }, {
            id: 2,
            name: 'Finish Book',
            description: 'Read one chapter per day',
            progress: 75
        }];

        const renderHabits = () => {
            habitsGrid.innerHTML = '';
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
                    renderHabits();
                });
            });
        };

        const renderGoals = () => {
            goalsList.innerHTML = '';
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

            // Simple check to add as a new goal
            goals.push({
                id: goals.length + 1,
                name: name,
                description: description,
                progress: 0
            });
            hideModal();
            renderGoals();
        });

        addGoalBtn.addEventListener('click', showModal);
        closeGoalModalBtn.addEventListener('click', hideModal);

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

        let journalEntries = [{
            id: 1,
            title: 'Morning Reflection',
            date: 'September 24, 2025',
            body: 'Felt very productive this morning after completing my workout and organizing my tasks for the day. Focusing on deep work today...'
        }, {
            id: 2,
            title: 'New Project Idea',
            date: 'September 23, 2025',
            body: 'Had a breakthrough idea for a new web project. It involves a personalized AI assistant that can summarize long articles and create to-do lists from them.'
        }];

        const renderJournal = () => {
            journalList.innerHTML = '';
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
                id: journalEntries.length + 1,
                title: title,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                body: body
            };

            journalEntries.unshift(newEntry);
            hideModal();
            renderJournal();
        });

        addJournalBtn.addEventListener('click', showModal);
        closeJournalModalBtn.addEventListener('click', hideModal);

        renderJournal();
    }

    // Wellness Module
    function initWellness() {
        console.log("Wellness module initialized.");
        // Add wellness-specific JavaScript here
    }
});
