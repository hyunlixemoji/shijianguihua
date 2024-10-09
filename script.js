document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const taskInput = document.getElementById('taskInput').value.trim();
        const timeInput = parseInt(document.getElementById('timeInput').value);

        if (taskInput && !isNaN(timeInput)) {
            showPriorityPrompt(taskInput, timeInput);
        } else {
            alert('请填写有效的待办事项和时间');
        }
    });
});

// 显示优先级选择提示框
function showPriorityPrompt(taskInput, timeInput) {
    const promptBox = document.getElementById('priorityPrompt');
    promptBox.style.display = 'block';
    const priorityMap = { '1': 'red', '2': 'yellow', '3': 'green', '4': 'blue' };

    const selectPriority = (priority) => {
        const dotClass = priorityMap[priority];
        if (!dotClass) return alert('无效的选择');

        const task = { name: taskInput, time: timeInput, dotClass };
        addTaskToList(task);
        saveTask(task);
        document.getElementById('taskInput').value = '';
        document.getElementById('timeInput').value = '';
        promptBox.style.display = 'none';
    };

    ['1', '2', '3', '4'].forEach(priority => {
        document.getElementById(`priority${priority}`).onclick = () => selectPriority(priority);
    });
}

// 添加待办事项到相应列表
function addTaskToList(task) {
    const listId = task.time <= 5 ? 'tasks5MinList' :
                   task.time <= 10 ? 'tasks10MinList' :
                   task.time <= 60 ? 'tasks1HourList' : 'tasksOver1HourList';

    const li = document.createElement('li');
    li.innerHTML = `<span class="dot ${task.dotClass}"></span>${task.name} (${task.time} 分钟)`;
    
    li.onclick = () => {
        li.style.textDecoration = 'line-through';
        setTimeout(() => li.remove(), 2000);
        removeTaskFromStorage(task);
    };

    document.getElementById(listId).appendChild(li);
}

// 保存任务到本地存储
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify([...tasks, task]));
}

// 从本地存储中删除任务
function removeTaskFromStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify(tasks.filter(t => t.name !== task.name || t.time !== task.time)));
}

// 加载已保存的任务
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToList);
}
