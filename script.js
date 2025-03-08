document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const task = taskInput.value.trim();

        // Prevent empty task
        if (!task) {
            alert('Task cannot be empty!');
            return;
        }

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <span>${task}</span>
            <div>
                <button class="btn btn-sm btn-warning edit-button">Edit</button>
                <button class="btn btn-sm btn-success done-button">Done</button>
                <button class="btn btn-sm btn-danger delete-button">Delete</button>
            </div>
        `;

        taskList.appendChild(listItem);
        saveTasks();
        taskInput.value = ''; // Clear input after adding
    }

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        const taskText = listItem.querySelector('span');

        if (e.target.classList.contains('delete-button')) {
            listItem.remove();
        } else if (e.target.classList.contains('done-button')) {
            listItem.classList.toggle('list-group-item-success');
            taskText.style.textDecoration = listItem.classList.contains('list-group-item-success') ? 'line-through' : 'none';
        } else if (e.target.classList.contains('edit-button')) {
            const newText = prompt('Edit Task:', taskText.textContent.trim());
            if (newText && newText.trim() !== '') {
                taskText.textContent = newText.trim();
            } else {
                alert('Task cannot be empty!');
            }
        }
        saveTasks();
    });

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#taskList li').forEach((listItem) => {
            tasks.push({
                text: listItem.querySelector('span').textContent,
                done: listItem.classList.contains('list-group-item-success')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            if (task.done) {
                listItem.classList.add('list-group-item-success');
            }
            listItem.innerHTML = `
                <span style="text-decoration: ${task.done ? 'line-through' : 'none'};">${task.text}</span>
                <div>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <button class="btn btn-sm btn-success done-button">${task.done ? 'Undo' : 'Done'}</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    }
});
