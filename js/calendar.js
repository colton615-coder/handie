// This function will run once the calendar module is loaded.
const initCalendar = () => {
    const monthYearDisplay = document.getElementById('month-year-display');
    const calendarGrid = document.querySelector('.calendar-grid');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');

    // Ensure all necessary elements are present.
    if (!monthYearDisplay || !calendarGrid || !prevMonthBtn || !nextMonthBtn) {
        console.error('Calendar elements not found. Initialization failed.');
        return;
    }

    let currentDate = new Date();

    const renderCalendar = () => {
        // Set the year and month for calculations.
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Update the header display (e.g., "September 2025").
        monthYearDisplay.textContent = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long'
        }).format(currentDate);

        // Clear the previous month's grid.
        // We keep the first 7 elements, which are the day name headers.
        while (calendarGrid.children.length > 7) {
            calendarGrid.removeChild(calendarGrid.lastChild);
        }

        // --- Calendar Logic ---
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create empty cells for the days before the 1st of the month.
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }

        // Create cells for each day of the month.
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            // Highlight the current day.
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('today');
            }

            calendarGrid.appendChild(dayCell);
        }
    };

    // --- Event Listeners for Navigation ---
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render of the calendar.
    renderCalendar();
};

// Use a small delay to ensure the module HTML is fully rendered.
setTimeout(initCalendar, 0);
