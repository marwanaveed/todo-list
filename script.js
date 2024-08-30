document.addEventListener("DOMContentLoaded", function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const taskInput = document.querySelector('.enter input[type="text"]');
    const taskContainer = document.querySelector('.task-container');
    const searchInput = document.querySelector('.search input');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  
    const currentTheme = localStorage.getItem('theme') || 'dark';
    setTheme(currentTheme);

 
    function setTheme(theme) {
        body.className = theme;
        themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i> Light Mode' : '<i class="fa-solid fa-moon"></i> Dark Mode';
        themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'false' : 'true');
        localStorage.setItem('theme', theme);
    }

    themeToggleBtn.addEventListener('click', function() {
        const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
        setTheme(newTheme);
    });

   
    function addTask(taskName) {
        const task = {
            id: Date.now(),
            name: taskName,
            completed: false
        };
        tasks.push(task);
        renderTasks(tasks);
        saveTasks();
    }

    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && taskInput.value.trim()) {
            addTask(taskInput.value.trim());
            taskInput.value = '';
        }
    });

    document.querySelector('.fa-plus').addEventListener('click', function() {
        if (taskInput.value.trim()) {
            addTask(taskInput.value.trim());
            taskInput.value = '';
        }
    });

   
    function renderTasks(taskList) {
        taskContainer.innerHTML = '';
        taskList.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.setAttribute('data-id', task.id);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.classList.add('task-checkbox');

            const taskText = document.createElement('span');
            taskText.classList.add('task-text');
            taskText.textContent = task.name;

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid', 'fa-trash', 'task-delete');
            deleteIcon.setAttribute('aria-label', 'Delete task');

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteIcon);
            taskContainer.appendChild(taskItem);

            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveTasks();
            });

            deleteIcon.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks(tasks);
                saveTasks();
            });
        });
    }

   
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

   
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm));
        renderTasks(filteredTasks);
    });

    renderTasks(tasks);
});
