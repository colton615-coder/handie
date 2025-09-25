// This function will run once the tasks module is loaded into the page
const initTasks = () => {
  const taskForm = document.getElementById('add-task-form');
  const taskInput = document.getElementById('new-task-input');
  const taskList = document.getElementById('task-list');

  // Ensure the necessary elements exist before adding event listeners
  if (!taskForm || !taskInput || !taskList) {
    console.error('Task module elements not found. Initialization failed.');
    return;
  }

  // Listen for the form submission to add a new task
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents the default form submission (page reload)
    
    const taskText = taskInput.value.trim(); // Get the text and remove whitespace

    if (taskText !== '') {
      addTask(taskText);
      taskInput.value = ''; // Clear the input field
      taskInput.focus(); // Set focus back to the input for quick adding
    }
  });

  // Function to create and add a new task item to the list
  const addTask = (text) => {
    // Create the list item element
    const li = document.createElement('li');
    li.className = 'task-item';

    // Create the checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    // Create the label for the task text
    const label = document.createElement('label');
    label.textContent = text;
    
    // Add a click listener to the checkbox to toggle the 'completed' state
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        label.style.textDecoration = 'line-through';
        label.style.color = 'var(--text-secondary)';
      } else {
        label.style.textDecoration = 'none';
        label.style.color = 'var(--text-primary)';
      }
    });

    // Assemble the new task item
    li.appendChild(checkbox);
    li.appendChild(label);
    
    // Add the new item to the top of the list
    taskList.prepend(li);
  };
};

// A delay is added to ensure the module's HTML is fully rendered before the script runs.
setTimeout(initTasks, 0);
