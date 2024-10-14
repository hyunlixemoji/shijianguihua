document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const taskInput = document.getElementById('taskInput').value.trim();
        const timeInput = parseInt(document.getElementById('timeInput').value);
        if (taskInput && !isNaN(timeInput)) showPriorityPrompt(taskInput, timeInput);
        else alert('请填写有效的待办事项和时间');
    });
});

function showPriorityPrompt(taskInput, timeInput) {
    const promptBox = document.getElementById('priorityPrompt');
    promptBox.style.display = 'block';
    ['1', '2', '3', '4'].forEach(priority => {
        document.getElementById(`priority${priority}`).onclick = () => {
            const dotClass = ['red', 'yellow', 'green', 'blue'][priority - 1];
            addTaskToList({ name: taskInput, time: timeInput, dotClass });
            saveTask({ name: taskInput, time: timeInput, dotClass });
            document.getElementById('taskInput').value = '';
            document.getElementById('timeInput').value = '';
            promptBox.style.display = 'none';
        };
    });
}

function addTaskToList(task) {
    const listId = task.time <= 5 ? 'tasks5MinList' :
                   task.time <= 10 ? 'tasks10MinList' :
                   task.time <= 60 ? 'tasks1HourList' : 'tasksOver1HourList';
    const li = document.createElement('li');
    li.innerHTML = `<span class="dot ${task.dotClass}"></span>${task.name} (${task.time} 分钟)`;
    li.onclick = () => { li.style.textDecoration = 'line-through'; setTimeout(() => li.remove(), 2000); removeTaskFromStorage(task); };
    document.getElementById(listId).appendChild(li);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify([...tasks, task]));
}

function removeTaskFromStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify(tasks.filter(t => t.name !== task.name || t.time !== task.time)));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToList);
}
