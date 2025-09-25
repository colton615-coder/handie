(() => {
    let currentDate = new Date();
    let events = [];

    const saveEvents = () => localStorage.setItem('handbook_events', JSON.stringify(events));
    const loadEvents = () => {
        const storedEvents = localStorage.getItem('handbook_events');
        events = storedEvents ? JSON.parse(storedEvents) : [];
    };

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

        for (let i = 0; i < firstDayOfMonth; i++) calendarGrid.innerHTML += `<div class="day-cell blank"></div>`;
        
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
        
        document.querySelectorAll('.day-cell:not(.blank)').forEach(day => {
            day.addEventListener('click', (e) => renderPlanner(e.currentTarget.dataset.date));
        });
    };

    const renderPlanner = (dateStr) => {
        const plannerList = document.getElementById('daily-planner-list');
        const plannerTitle = document.getElementById('planner-date-title');
        if (!plannerList || !plannerTitle) return;

        const [year, month, day] = dateStr.split('-');
        const dateObj = new Date(year, month - 1, day);
        plannerTitle.textContent = `Events for ${dateObj.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        plannerList.innerHTML = '';
        const dayEvents = events.filter(event => event.date === dateStr).sort((a,b) => (a.time || '').localeCompare(b.time || ''));

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
    
    const initializeCalendar = () => {
        App.ModalManager.initialize({
            modalId: 'event-modal',
            openBtnId: 'add-event-btn',
            closeBtnId: 'close-event-modal-btn',
            formId: 'event-form',
            onFormSubmit: (data) => {
                const newEvent = {
                    title: data['event-title'],
                    details: data['event-details'],
                    date: data['event-date'],
                    time: data['event-time']
                };
                events.push(newEvent);
                saveEvents();
                renderCalendar();
                renderPlanner(newEvent.date);
            }
        });
        
        document.querySelector('.prev-month')?.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        document.querySelector('.next-month')?.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        loadEvents();
        renderCalendar();
        renderPlanner(new Date().toISOString().slice(0, 10));
    };

    const observer = new MutationObserver((mutationsList) => {
        if (mutationsList.some(m => m.type === 'childList' && document.querySelector('.calendar-content'))) {
            initializeCalendar();
        }
    });
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
})();
