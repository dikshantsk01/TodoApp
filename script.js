// Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");

// Load tasks from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks helper
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task counter UI
function updateTaskCount() {
    const remaining = tasks.filter(t => !t.completed).length;
    const total = tasks.length;
    if (total === 0) {
        taskCount.textContent = "No tasks yet";
    } else if (remaining === 1) {
        taskCount.textContent = "1 task remaining";
    } else {
        taskCount.textContent = `${remaining} tasks remaining`;
    }

    // enable/disable clear completed button based on presence of completed tasks
    const hasCompleted = tasks.some(t => t.completed);
    clearCompletedBtn.disabled = !hasCompleted;
}

// Render UI
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        // task text container (so delete button doesn't trigger toggle)
        const span = document.createElement("div");
        span.className = "task-text";
        span.textContent = task.text;

        // toggle completion when clicking the text
        span.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "delete-btn";

        delBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent toggling when deleting
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    updateTaskCount();
}

// Add new task
function addTaskFromInput() {
    const text = taskInput.value.trim();
    if (text === "") return;
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
}

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

// Add button + Enter key support
addBtn.addEventListener("click", addTaskFromInput);
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTaskFromInput();
});

// Initial render
renderTasks();
