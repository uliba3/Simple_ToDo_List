// DOM Elements
const taskInput = document.getElementById('taskInput');
const startDate = document.getElementById('startDate');
const dueDate = document.getElementById('dueDate');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const sortSelect = document.getElementById('sortSelect');

// Task Management
class TaskManager {
    constructor() {
        this.tasks = [];
        this.sortBy = 'none';
        this.loadTasks();
        this.loadInputValues();
    }

    async loadTasks() {
        const result = await chrome.storage.sync.get(['tasks']);
        this.tasks = result.tasks || [];
        this.renderTasks();
    }

    async loadInputValues() {
        const result = await chrome.storage.sync.get(['inputValues']);
        if (result.inputValues) {
            taskInput.value = result.inputValues.taskText || '';
            startDate.value = result.inputValues.startDate || '';
            dueDate.value = result.inputValues.dueDate || '';
        }
    }

    async saveInputValues() {
        const inputValues = {
            taskText: taskInput.value,
            startDate: startDate.value,
            dueDate: dueDate.value
        };
        await chrome.storage.sync.set({ inputValues });
    }

    async clearInputValues() {
        taskInput.value = '';
        startDate.value = '';
        dueDate.value = '';
        await chrome.storage.sync.remove(['inputValues']);
    }

    async addTask(taskText, startDate, dueDate) {
        if (!taskText.trim()) return;

        const task = {
            id: Date.now(),
            text: taskText,
            'start-date': startDate || null,
            'due-date': dueDate || null
        };

        console.log(task);

        this.tasks.push(task);
        await this.saveTasks();
        this.renderTasks();
        await this.clearInputValues();
        return task;
    }

    async updateTask(taskId, updates) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
        await this.saveTasks();
        this.renderTasks();
    }

    async deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        await this.saveTasks();
        this.renderTasks();
    }

    async saveTasks() {
        await chrome.storage.sync.set({ tasks: this.tasks });
    }

    setSortBy(sortType) {
        this.sortBy = sortType;
        this.renderTasks();
    }

    getSortedTasks() {
        if (this.sortBy === 'none') {
            return this.tasks;
        }

        return [...this.tasks].sort((a, b) => {
            const dateA = a[this.sortBy] ? new Date(a[this.sortBy]) : null;
            const dateB = b[this.sortBy] ? new Date(b[this.sortBy]) : null;

            // If both have dates, compare them
            if (dateA && dateB) {
                return dateA - dateB;
            }
            // If only one has a date
            if (dateA && !dateB) {
                // For start date, no date comes first
                if (this.sortBy === 'start-date') {
                    return 1;
                }
                // For due date, no date comes last
                return -1;
            }
            if (!dateA && dateB) {
                // For start date, no date comes first
                if (this.sortBy === 'start-date') {
                    return -1;
                }
                // For due date, no date comes last
                return 1;
            }
            // If neither has a date, maintain original order
            return 0;
        });
    }

    renderTasks() {
        taskList.innerHTML = '';
        const sortedTasks = this.getSortedTasks();
        sortedTasks.forEach(task => this.createTaskElement(task));
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
        li.draggable = true;
        
        const taskText = this.createTaskText(task);
        const datesContainer = this.createDatesContainer(task);
        const deleteBtn = this.createDeleteButton(task.id);

        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';
        taskContainer.appendChild(datesContainer);
        taskContainer.appendChild(taskText);

        li.appendChild(taskContainer);
        li.appendChild(deleteBtn);

        this.setupDragEvents(li);
        taskList.appendChild(li);
    }

    createTaskText(task) {
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        taskText.addEventListener('click', () => this.editTaskText(task));
        return taskText;
    }

    createDatesContainer(task) {
        const container = document.createElement('div');
        container.className = 'task-dates';
        
        const startDateSpan = document.createElement('span');
        startDateSpan.className = 'start-date';
        startDateSpan.textContent = task['start-date'] ? this.formatDate(task['start-date']) : 'No start date';
        startDateSpan.addEventListener('click', () => this.editDate(task, 'start-date'));
        
        const separatorSpan = document.createElement('span');
        separatorSpan.className = 'date-separator';
        separatorSpan.textContent = ' ~ ';
        
        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = 'due-date';
        dueDateSpan.textContent = task['due-date'] ? this.formatDate(task['due-date']) : 'No due date';
        dueDateSpan.addEventListener('click', () => this.editDate(task, 'due-date'));
        
        container.appendChild(startDateSpan);
        container.appendChild(separatorSpan);
        container.appendChild(dueDateSpan);
        
        return container;
    }

    createDeleteButton(taskId) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'x';
        deleteBtn.addEventListener('click', () => this.deleteTask(taskId));
        return deleteBtn;
    }

    setupDragEvents(element) {
        element.addEventListener('dragstart', () => {
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            this.updateTaskOrder();
        });
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    async updateTaskOrder() {
        const taskElements = taskList.querySelectorAll('.task-item');
        const taskIds = Array.from(taskElements).map(element => parseInt(element.dataset.id));
        
        const orderedTasks = [];
        taskIds.forEach(id => {
            const task = this.tasks.find(t => t.id === id);
            if (task) orderedTasks.push(task);
        });
        
        this.tasks = orderedTasks;
        await this.saveTasks();
    }

    async editTaskText(task) {
        const taskElement = document.querySelector(`[data-id="${task.id}"]`);
        const taskText = taskElement.querySelector('.task-text');
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'task-text';
        
        taskText.replaceWith(input);
        input.focus();
        
        const saveEdit = async () => {
            const newText = input.value.trim();
            if (newText) {
                await this.updateTask(task.id, { text: newText });
            } else {
                input.replaceWith(taskText);
            }
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }

    async editDate(task, dateType) {
        const taskElement = document.querySelector(`[data-id="${task.id}"]`);
        const datesContainer = taskElement.querySelector('.task-dates');
        const dateSpan = datesContainer.querySelector(`.${dateType}`);
        const input = document.createElement('input');
        input.type = 'datetime-local';
        input.value = task[dateType] || '';
        input.className = `${dateType}`;
        
        dateSpan.replaceWith(input);
        input.focus();
        
        const saveEdit = async () => {
            const newDate = input.value || null;
            await this.updateTask(task.id, { [dateType]: newDate });
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('change', saveEdit);
    }
}

// Event Handlers
function setupEventListeners(taskManager) {
    // Save input values when they change
    taskInput.addEventListener('input', () => taskManager.saveInputValues());
    startDate.addEventListener('change', () => taskManager.saveInputValues());
    dueDate.addEventListener('change', () => taskManager.saveInputValues());

    addButton.addEventListener('click', () => {
        taskManager.addTask(taskInput.value, startDate.value, dueDate.value);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            taskManager.addTask(taskInput.value, startDate.value, dueDate.value);
        }
    });

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (!draggingItem || draggingItem.querySelector('.edit-container')) return;
        
        const siblings = [...taskList.querySelectorAll('.task-item:not(.dragging)')];
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            return e.clientY - box.top - box.height / 2 < 0;
        });

        taskList.insertBefore(draggingItem, nextSibling);
    });

    sortSelect.addEventListener('change', (e) => {
        taskManager.setSortBy(e.target.value);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    setupEventListeners(taskManager);
}); 