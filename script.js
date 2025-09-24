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

    // Tasks Module (placeholder)
    function initTasks() {
        console.log("Tasks module initialized.");
        // Add tasks-specific JavaScript here later
    }

    // Goals Module (placeholder)
    function initGoals() {
        console.log("Goals module initialized.");
        // Add goals-specific JavaScript here later
    }

    // Journal Module (placeholder)
    function initJournal() {
        console.log("Journal module initialized.");
        // Add journal-specific JavaScript here later
    }

    // Wellness Module (placeholder)
    function initWellness() {
        console.log("Wellness module initialized.");
        // Add wellness-specific JavaScript here later
    }
});
