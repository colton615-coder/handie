(() => {
    let currentDate = new Date();
    let events = []; // { title, details, date, time }

    // --- Data Persistence ---
    const saveEvents = () => {
        localStorage.setItem('handbook_events', JSON.stringify(events));
    };

    const loadEvents = () => {
        const storedEvents = localStorage.getItem('handbook_events');
        events = storedEvents ? JSON.parse(storedEvents) : [];
    };

    // --- Rendering Functions ---
    const renderCalendar = () => {
        const calendarGrid = document.getElementById('calendar-days-grid');
        const monthYearDisplay = document.getElementById('current-month-year');
        if (!calendarGrid || !monthYearDisplay) return;

        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        
        monthYearDisplay.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        calendarGrid.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 1. Add blank cells for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.innerHTML += `<div class="day-cell blank"></div>`;
        }

        // 2. Add cells for each day of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const today = new Date();
            const isCurrentDay = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const hasEvent = events.some(event => event.date === dateStr);

            calendarGrid.innerHTML += `
                <div class="day-cell ${isCurrentDay ? 'today' : ''}" data-date="${dateStr}">
                    ${i}
                    ${hasEvent ? '<div class="event-dot"></div>' : ''}
                </div>
            `;
        }
        
        // Add click listener to newly rendered days
        document.querySelectorAll('.day-cell:not(.blank)').forEach(day => {
            day.addEventListener('click', (e) => {
                const selectedDate = e.currentTarget.dataset.date;
                renderPlanner(selectedDate);
            });
        });
    };

    const renderPlanner = (dateStr) => {
        const plannerList = document.getElementById('daily-planner-list');
        const plannerTitle = document.getElementById('planner-date-title');
        if (!plannerList || !plannerTitle) return;

        const [year, month, day] = dateStr.split('-');
        const dateObj = new Date(year, month - 1, day);
        plannerTitle.textContent = `Events for ${dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

        plannerList.innerHTML = '';
        const dayEvents = events.filter(event => event.date === dateStr).sort((a,b) => a.time.localeCompare(b.time));

        if (dayEvents.length === 0) {
            plannerList.innerHTML = '<li>No events scheduled.</li>';
        } else {
            dayEvents.forEach(event => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="event-time">${event.time ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}) : 'All Day'}</div>
                    <div class="event-details">
                        <p class="event-title">${event.title}</p>
                        ${event.details ? `<p class="event-location">${event.details}</p>` : ''}
                    </div>
                `;
                plannerList.appendChild(li);
            });
        }
    };
    
    // --- Main Initialization ---
    const initializeCalendar = () => {
        // Navigation buttons
        document.querySelector('.prev-month')?.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        document.querySelector('.next-month')?.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        // Modal Handling
        const eventModal = document.getElementById('event-modal');
        const addEventBtn = document.getElementById('add-event-btn');
        const closeEventModalBtn = document.getElementById('close-event-modal-btn');
        const eventForm = document.getElementById('event-form');

        const closeModal = () => {
            eventModal.style.display = 'none';
            eventForm.reset();
        };
        
        addEventBtn?.addEventListener('click', () => {
            eventModal.style.display = 'flex';
            // Pre-fill date with today's date
            document.getElementById('event-date').value = new Date().toISOString().slice(0, 10);
        });
        closeEventModalBtn?.addEventListener('click', closeModal);
        eventModal?.addEventListener('click', e => { if (e.target === eventModal) closeModal(); });
        
        // Form Submission
        eventForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const newEvent = {
                title: document.getElementById('event-title').value,
                details: document.getElementById('event-details').value,
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value
            };
            events.push(newEvent);
            saveEvents();
            renderCalendar();
            renderPlanner(newEvent.date); // Update planner for the new event's date
            closeModal();
        });

        // Initial Load
        loadEvents();
        renderCalendar();
        renderPlanner(new Date().toISOString().slice(0, 10)); // Show today's events initially
    };

    // --- Observer to re-initialize when content is loaded ---
    const observer = new MutationObserver((mutationsList) => {
        if (mutationsList.some(m => m.type === 'childList' && document.querySelector('.calendar-content'))) {
            initializeCalendar();
        }
    });

    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
})();


