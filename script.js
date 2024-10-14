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
            const priorityLabels = ['red', 'yellow', 'green', 'blue'];
            const dotClass = priorityLabels[priority - 1];
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
    li.style.wordWrap = 'break-word';  // 支持自动换行
    li.ondblclick = () => {
        li.style.textDecoration = 'line-through';
        setTimeout(() => li.remove(), 2000);
        removeTaskFromStorage(task);
    };
    li.oncontextmenu = (event) => {
        event.preventDefault();  // 防止右键菜单
        const taskData = prompt('修改待办事项 (格式: 内容,时间)', `${task.name},${task.time}`);
        if (taskData) {
            const [newName, newTime] = taskData.split(',');
            if (newName && !isNaN(newTime)) {
                updateTask(li, { name: newName.trim(), time: parseInt(newTime), dotClass: task.dotClass });
            } else {
                alert('无效的输入');
            }
        }
    };
    document.getElementById(listId).appendChild(li);
}

function updateTask(li, task) {
    li.innerHTML = `<span class="dot ${task.dotClass}"></span>${task.name} (${task.time} 分钟)`;
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
