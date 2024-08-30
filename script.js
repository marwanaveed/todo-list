document.addEventListener("DOMContentLoaded", function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const taskInput = document.querySelector('.enter input[type="text"]');
    const taskContainer = document.querySelector('.task-container');
    const searchInput = document.querySelector('.search input');
    const section = document.location.pathname.split('/').pop().replace('.html', '') || 'index'; 
    const sections = ['index', 'important', 'planned', 'assigned'];

    let tasks = {
        'index': JSON.parse(localStorage.getItem('tasks_index')) || [],
        'important': JSON.parse(localStorage.getItem('tasks_important')) || [],
        'planned': JSON.parse(localStorage.getItem('tasks_planned')) || [],
        'assigned': JSON.parse(localStorage.getItem('tasks_assigned')) || []
    };

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

    function addTask(taskName, section) {
        const task = {
            id: Date.now(),
            name: taskName,
            completed: false
        };
        tasks[section].push(task);
        renderTasks(section);
        saveTasks();
    }

    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && taskInput.value.trim()) {
            addTask(taskInput.value.trim(), section);
            taskInput.value = '';
        }
    });

    document.querySelector('.fa-plus').addEventListener('click', function() {
        if (taskInput.value.trim()) {
            addTask(taskInput.value.trim(), section);
            taskInput.value = '';
        }
    });

    function renderTasks(section) {
        taskContainer.innerHTML = '';
        tasks[section].forEach(task => {
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
                tasks[section] = tasks[section].filter(t => t.id !== task.id);
                renderTasks(section);
                saveTasks();
            });
        });
        
        if (section === 'index') {
            const allTasks = sections.flatMap(sec => tasks[sec]);
            taskContainer.innerHTML = '';
            allTasks.forEach(task => {
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
                    const sectionToRemove = Object.keys(tasks).find(sec => tasks[sec].some(t => t.id === task.id));
                    tasks[sectionToRemove] = tasks[sectionToRemove].filter(t => t.id !== task.id);
                    renderTasks('index');
                    saveTasks();
                });
            });
        }
    }

    function saveTasks() {
        Object.keys(tasks).forEach(section => {
            localStorage.setItem(`tasks_${section}`, JSON.stringify(tasks[section]));
        });
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = sections.flatMap(sec => tasks[sec]).filter(task => task.name.toLowerCase().includes(searchTerm));
        taskContainer.innerHTML = '';
        filteredTasks.forEach(task => {
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
                const sectionToRemove = Object.keys(tasks).find(sec => tasks[sec].some(t => t.id === task.id));
                tasks[sectionToRemove] = tasks[sectionToRemove].filter(t => t.id !== task.id);
                renderTasks('index');
                saveTasks();
            });
        });
    });

    renderTasks(section);
});
