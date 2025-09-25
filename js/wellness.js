(() => {
    let wellnessData = {
        workouts: [],
        golfRounds: [],
        nutrition: []
    };

    const saveData = () => localStorage.setItem('handbook_wellness', JSON.stringify(wellnessData));
    const loadData = () => {
        const storedData = localStorage.getItem('handbook_wellness');
        if (storedData) {
            wellnessData = JSON.parse(storedData);
        }
    };

    const renderDetailView = (trackerType) => {
        const detailView = document.getElementById('wellness-detail-view');
        if (!detailView) return;

        let title = '';
        let formHtml = '';
        let logHtml = '';

        const today = new Date().toISOString().slice(0, 10);

        switch (trackerType) {
            case 'workout':
                title = 'Workout Log';
                formHtml = `
                    <h4>Log a New Workout</h4>
                    <form id="workout-form">
                        <input type="date" name="date" value="${today}" required>
                        <input type="text" name="type" placeholder="Workout Type (e.g., Running, Lifting)" required>
                        <input type="number" name="duration" placeholder="Duration (minutes)">
                        <button type="submit" class="btn btn-primary">Log Workout</button>
                    </form>
                `;
                logHtml = wellnessData.workouts.map(w => `<li class="log-item">${w.date}: ${w.type} - ${w.duration} min</li>`).join('');
                break;
            case 'golf':
                title = 'Golf Log';
                formHtml = `
                    <h4>Log a New Round</h4>
                    <form id="golf-form">
                        <input type="date" name="date" value="${today}" required>
                        <input type="text" name="course" placeholder="Course Name" required>
                        <input type="number" name="score" placeholder="Final Score">
                        <button type="submit" class="btn btn-primary">Log Round</button>
                    </form>
                `;
                logHtml = wellnessData.golfRounds.map(g => `<li class="log-item">${g.date}: ${g.course} - Score: ${g.score}</li>`).join('');
                break;
            case 'nutrition':
                title = 'Nutrition Log';
                formHtml = `
                    <h4>Log a Meal</h4>
                    <form id="nutrition-form">
                        <input type="date" name="date" value="${today}" required>
                        <input type="text" name="meal" placeholder="Meal (e.g., Breakfast, Lunch)" required>
                        <textarea name="notes" placeholder="Notes (e.g., calories, ingredients)"></textarea>
                        <button type="submit" class="btn btn-primary">Log Meal</button>
                    </form>
                `;
                logHtml = wellnessData.nutrition.map(n => `<li class="log-item"><strong>${n.date} (${n.meal}):</strong> ${n.notes}</li>`).join('');
                break;
        }

        detailView.innerHTML = `
            <h3 class="card-title">${title}</h3>
            ${formHtml}
            <div class="log-history">
                <h4>History</h4>
                <ul id="log-list">${logHtml || '<li>No entries yet.</li>'}</ul>
            </div>
        `;
        detailView.style.display = 'block';

        // Add form submission listener
        const form = detailView.querySelector('form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (trackerType === 'workout') wellnessData.workouts.unshift(data);
            if (trackerType === 'golf') wellnessData.golfRounds.unshift(data);
            if (trackerType === 'nutrition') wellnessData.nutrition.unshift(data);
            
            saveData();
            renderDetailView(trackerType); // Re-render to show the new log entry
        });
    };

    const initializeWellness = () => {
        const trackerCards = document.querySelectorAll('.tracker-card');
        trackerCards.forEach(card => {
            card.addEventListener('click', () => {
                const trackerType = card.dataset.tracker;
                renderDetailView(trackerType);
            });
        });

        loadData();
    };

    const observer = new MutationObserver((mutationsList) => {
        if (mutationsList.some(m => m.type === 'childList' && document.querySelector('.wellness-content'))) {
            initializeWellness();
        }
    });
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
})();
