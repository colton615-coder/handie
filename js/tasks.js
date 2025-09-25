const initTasks = () => {
  const taskForm = document.getElementById('add-task-form');
  const taskInput = document.getElementById('new-task-input');
  const taskList = document.getElementById('task-list');

  if (!taskForm || !taskInput || !taskList) {
    console.error('Task module elements not found. Initialization failed.');
    return;
  }

  // --- Core Functions ---

  // Function to render tasks from the saved data
  const renderTasks = () => {
    // Clear the existing list first
    taskList.innerHTML = '';
    const tasks = getTasks();
    tasks.forEach(task => {
      createTaskElement(task.text, task.completed);
    });
  };

  // Function to create and add a new task element to the DOM
  const createTaskElement = (text, isCompleted) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;

    const label = document.createElement('label');
    label.textContent = text;

    // Apply completed style if necessary
    if (isCompleted) {
      label.style.textDecoration = 'line-through';
      label.style.color = 'var(--text-secondary)';
    }
    
    // Event listener to handle checking/unchecking a task
    checkbox.addEventListener('change', () => {
      toggleTaskCompletion(text);
      renderTasks(); // Re-render to reflect the change
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    taskList.appendChild(li); // Append to the end to maintain order
  };

  // --- localStorage Logic ---

  // Function to get tasks from localStorage
  const getTasks = () => {
    // Get the string from storage, or an empty array string if it doesn't exist
    const tasksString = localStorage.getItem('myTasks') || '[]';
    return JSON.parse(tasksString); // Convert the JSON string back to an array
  };

  // Function to save the entire tasks array to localStorage
  const saveTasks = (tasks) => {
    localStorage.setItem('myTasks', JSON.stringify(tasks)); // Convert array to a JSON string
  };

  // Function to add a new task to storage
  const addTask = (text) => {
    const tasks = getTasks();
    // Add the new task object to the array
    tasks.push({ text: text, completed: false });
    saveTasks(tasks);
  };

  // Function to update the completion status of a task
  const toggleTaskCompletion = (text) => {
    const tasks = getTasks();
    const taskToUpdate = tasks.find(task => task.text === text);
    if (taskToUpdate) {
      taskToUpdate.completed = !taskToUpdate.completed;
      saveTasks(tasks);
    }
  };

  // --- Event Listeners ---

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      addTask(taskText);
      renderTasks(); // Re-render the list with the new task
      taskInput.value = '';
      taskInput.focus();
    }
  });

  // --- Initial Load ---
  renderTasks(); // Load and display tasks when the module is first initialized
};

setTimeout(initTasks, 0);
