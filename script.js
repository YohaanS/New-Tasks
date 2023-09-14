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
    const dueDate = dueDateInput.value.trim(); // Get the selected due date as text

    // Check if the due date is before today (without considering time) or not specified
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
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
                <span class="task-due-date">${dueDate || 'No Due Date'}</span> <!-- Display due date or 'No Due Date' -->
                <button class="complete-button" onclick="completeTask(this)">Complete</button>
                <button class="delete-button" onclick="removeTask(this)">Delete</button>
            </div>
        </div>
    `;
    taskList.appendChild(li);

    taskInput.value = '';
    dueDateInput.value = '';

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
}

// Function to mark a task as complete
function completeTask(button) {
    const task = button.closest('.task');
    const taskText = task.querySelector('.task-text');
    taskText.classList.toggle('completed');
}

// Initialize the category dropdown
updateCategoryDropdown();

function notifyOverdueTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = taskList.getElementsByTagName('li');

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    for (const task of tasks) {
        const dueDateText = task.querySelector('.task-due-date').textContent;
        const dueDate = new Date(dueDateText);

        if (dueDate < today && !task.classList.contains('overdue')) {
            task.classList.add('overdue');

            // Display a notification
            const taskText = task.querySelector('.task-text').textContent;
            alert(`Task "${taskText}" is overdue!`);

            // You can also customize the notification further, e.g., by using a toast notification library
        }
    }
}

// Function to periodically check for overdue tasks (every minute)
setInterval(notifyOverdueTasks, 60000);
