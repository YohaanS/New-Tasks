// Array to store task categories
const categories = [];

// Function to add a new category
function addCategory() {
    const categoryInput = document.getElementById('categoryInput');
    const categoryName = categoryInput.value.trim();
    if (categoryName === '') return;

    // Check if the category already exists
    if (categories.includes(categoryName)) {
        alert('Category already exists!');
        return;
    }

    categories.push(categoryName);

    // Clear input field
    categoryInput.value = '';

    // Update the category dropdown
    updateCategoryDropdown();
}

// Function to delete all categories
function deleteCategories() {
    categories.length = 0;
    updateCategoryDropdown();
}

// Function to update the category dropdown
function updateCategoryDropdown() {
    const categoryDropdown = document.getElementById('categoryDropdown');
    categoryDropdown.innerHTML = '<option value="">All Categories</option>';

    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const categoryDropdown = document.getElementById('categoryDropdown');
    const selectedCategory = categoryDropdown.value;

    const priorityDropdown = document.getElementById('priorityDropdown');
    const selectedPriority = priorityDropdown.value;

    const dueDateInput = document.getElementById('dueDateInput');
    const dueDate = dueDateInput.value.trim();

    // Check if the due date is before today (without considering time) or not specified
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateObj = dueDate ? new Date(dueDate) : null;

    if (dueDateObj && dueDateObj < today) {
        alert('Due date is before today. Task not added.');
        return;
    }

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="task">
            <span class="task-text">${taskText}</span>
            <div class="task-details">
                <span class="task-category">${selectedCategory}</span>
                <span class="task-priority ${selectedPriority}">${selectedPriority}</span>
                <span class="task-due-date">${dueDate || 'No Due Date'}</span>
                <button class="complete-button" onclick="completeTask(this)">Complete</button>
                <button class="delete-button" onclick="removeTask(this)">Delete</button>
            </div>
        </div>
    `;
    taskList.appendChild(li);

    taskInput.value = '';
    dueDateInput.value = '';

    // Save the task to user data
    saveTaskToUserData({
        taskText,
        selectedCategory,
        selectedPriority,
        dueDate,
        completed: false,
    });
}

// Function to format a date as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate() + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function sortTasksByDueDate() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.getElementsByTagName('li'));

    tasks.sort((a, b) => {
        const dateA = new Date(a.querySelector('.task-due-date').textContent);
        const dateB = new Date(b.querySelector('.task-due-date').textContent);
        return dateA - dateB;
    });

    tasks.forEach((task) => {
        taskList.appendChild(task);
    });
}

// Function to remove a task
function removeTask(button) {
    const taskList = document.getElementById('taskList');
    const li = button.closest('li');
    taskList.removeChild(li);

    // Remove the task from user data
    removeTaskFromUserData(li);
}

// Function to mark a task as complete
function completeTask(button) {
    const task = button.closest('.task');
    const taskText = task.querySelector('.task-text');
    taskText.classList.toggle('completed');

    // Update the task completion status in user data
    updateTaskCompletionStatus(task, taskText.classList.contains('completed'));
}

// Initialize the category dropdown
updateCategoryDropdown();

// Function to save a task to user data
function saveTaskToUserData(taskData) {
    // Retrieve the logged-in user's username from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Check if a user is logged in
    if (loggedInUser) {
        // Retrieve user data from localStorage or create a new object if it doesn't exist
        const userData = JSON.parse(localStorage.getItem(loggedInUser)) || { tasks: [], settings: {} };

        // Add the new task to the user's data
        userData.tasks.push(taskData);

        // Save the updated user data back to localStorage
        localStorage.setItem(loggedInUser, JSON.stringify(userData));
    }
}

// Function to remove a task from user data
function removeTaskFromUserData(taskElement) {
    // Retrieve the logged-in user's username from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Check if a user is logged in
    if (loggedInUser) {
        // Retrieve user data from localStorage
        const userData = JSON.parse(localStorage.getItem(loggedInUser));

        if (userData) {
            // Find and remove the task data associated with the removed task element
            const taskText = taskElement.querySelector('.task-text').textContent;
            const updatedTasks = userData.tasks.filter((task) => task.taskText !== taskText);

            // Save the updated user data back to localStorage
            saveUserData(updatedTasks, userData.settings);
        }
    }
}

// Function to update the completion status of a task in user data
function updateTaskCompletionStatus(taskElement, completed) {
    // Retrieve the logged-in user's username from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Check if a user is logged in
    if (loggedInUser) {
        // Retrieve user data from localStorage
        const userData = JSON.parse(localStorage.getItem(loggedInUser));

        if (userData) {
            // Find and update the task data associated with the completed task element
            const taskText = taskElement.querySelector('.task-text').textContent;
            const updatedTasks = userData.tasks.map((task) => {
                if (task.taskText === taskText) {
                    task.completed = completed;
                }
                return task;
            });

            // Save the updated user data back to localStorage
            saveUserData(updatedTasks, userData.settings);
        }
    }
}

// Function to save user data after making changes
function saveUserData(updatedTasks, updatedSettings) {
    // Retrieve the logged-in user's username from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Check if a user is logged in
    if (loggedInUser) {
        // Retrieve user data from localStorage and parse it as JSON
        const userData = JSON.parse(localStorage.getItem(loggedInUser));

        if (userData) {
            // Update user data with the provided tasks and settings
            userData.tasks = updatedTasks;
            userData.settings = updatedSettings;

            // Save the updated user data back to localStorage
            localStorage.setItem(loggedInUser, JSON.stringify(userData));
        }
    }
}

// Function to load user tasks and settings from localStorage and populate the UI
function loadUserData() {
    // Retrieve the logged-in user's username from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Check if a user is logged in
    if (loggedInUser) {
        // Retrieve user data from localStorage and parse it as JSON
        const userData = JSON.parse(localStorage.getItem(loggedInUser));

        if (userData) {
            // Load user tasks and settings from userData and populate the UI
            // You can implement this part based on your HTML structure and design
        }
    }
}

// Function to initialize the UI with user data
function initializeUI() {
    // Load user tasks and settings from localStorage and populate the UI
    loadUserData();
}

// Call the initializeUI function to populate the UI with user data on page load
initializeUI();

function notifyOverdueTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = taskList.getElementsByTagName('li');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const task of tasks) {
        const dueDateText = task.querySelector('.task-due-date').textContent;
        const dueDate = new Date(dueDateText);

        if (dueDate < today && !task.classList.contains('overdue')) {
            task.classList.add('overdue');
            const taskText = task.querySelector('.task-text').textContent;
            alert(`Task "${taskText}" is overdue!`);
        }
    }
}

// Function to periodically check for overdue tasks (every minute)
setInterval(notifyOverdueTasks, 60000);

// Check if a user is already logged in
const loggedInUser = localStorage.getItem('loggedInUser');

if (loggedInUser) {
    // User is logged in, display the Logout button
    const logoutButtonContainer = document.getElementById('logoutButtonContainer');
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    logoutButton.className = 'logout-button';
    logoutButtonContainer.appendChild(logoutButton);

    // Add an event listener to handle logout
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser');
        // Redirect to the login page (replace 'login.html' with the actual URL)
        window.location.href = '/index.html';
    });
}


// Save task
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


// Save user settings
function saveSettings(settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

// Get user settings
function getSettings() {
    return JSON.parse(localStorage.getItem('userSettings')) || {};
}