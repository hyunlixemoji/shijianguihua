document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    document.getElementById('addTaskBtn').onclick = () => {
        const taskInput = document.getElementById('taskInput').value.trim();
        const timeInput = parseInt(document.getElementById('timeInput').value);
        if (taskInput && !isNaN(timeInput)) {
            showPriorityPrompt(taskInput, timeInput);
        } else {
            alert('请填写有效的待办事项和时间');
        }
    };

    document.getElementById('saveEditButton').onclick = () => {
        const name = document.getElementById('editTaskName').value;
        const time = parseInt(document.getElementById('editTaskTime').value);
        const priority = document.getElementById('editTaskPriority').value;
        const isDaily = document.getElementById('editTaskDaily').value === "yes";

        if (name && !isNaN(time) && ['red', 'yellow', 'green', 'blue'].includes(priority)) {
            updateTask(currentLi, { name, time, priority, isDaily });
            closeEditPrompt();
        } else {
            alert('请填写有效的信息');
        }
    };

    document.getElementById('cancelEditButton').onclick = closeEditPrompt;
    setInterval(resetDailyTasks, 24 * 60 * 60 * 1000);
    resetDailyTasks();
});

let currentLi;

function closeEditPrompt() {
    document.getElementById('editTaskPrompt').style.display = 'none';
}

function showEditPrompt(li) {
    currentLi = li;
    const task = getTaskFromLi(li);
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editTaskTime').value = task.time;
    document.getElementById('editTaskPriority').value = getPriorityFromDotColor(li.querySelector('.dot').style.backgroundColor);
    document.getElementById('editTaskDaily').value = task.isDaily ? 'yes' : 'no';
    document.getElementById('editTaskPrompt').style.display = 'block';
}

function getPriorityFromDotColor(color) {
    return color === 'rgb(255, 69, 0)' ? 'red' :
           color === 'rgb(255, 215, 0)' ? 'yellow' :
           color === 'rgb(50, 205, 50)' ? 'green' : 'blue';
}

function showPriorityPrompt(taskInput, timeInput) {
    const promptBox = document.getElementById('priorityPrompt');
    promptBox.style.display = 'block';
    document.querySelectorAll('#priorityPrompt button').forEach((button, idx) => {
        button.onclick = () => {
            const priority = getPriorityByIdx(idx);
            const task = { name: taskInput, time: timeInput, priority, isDaily: false };
            addTaskToList(task);
            saveTask(task);
            document.getElementById('taskInput').value = '';
            document.getElementById('timeInput').value = '';
            promptBox.style.display = 'none';
        };
    });
}

function addTaskToList(task) {
    const listId = getTaskListId(task.time);
    const li = document.createElement('li');
    li.innerHTML = `<span class="dot" style="background-color: ${getColorByPriority(task.priority)};"></span>${task.name} (${task.time} 分钟)`;
    if (task.isDaily) li.classList.add('daily-task');

    li.oncontextmenu = (event) => {
        event.preventDefault();
        showEditPrompt(li);
    };

    li.ondblclick = () => {
        if (!task.isDaily) {
            removeTask(task);
        } else {
            li.style.display = 'none';
            markTaskAsRemoved(task);
        }
    };

    document.getElementById(listId).appendChild(li);
}

function markTaskAsRemoved(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToUpdate = tasks.find(t => t.name === task.name && t.time === task.time);
    if (taskToUpdate) {
        taskToUpdate.hidden = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function removeTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToUpdate = tasks.find(t => t.name === task.name && t.time === task.time);
    if (taskToUpdate) {
        taskToUpdate.removed = true; // 用 removed 标记为已删除
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    const listItem = Array.from(document.querySelectorAll('li')).find(li => li.innerText.includes(task.name) && li.innerText.includes(`${task.time} 分钟`));
    if (listItem) listItem.remove();
}

function updateTask(li, task) {
    const currentTask = getTaskFromLi(li);
    if (!currentTask.isDaily) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskToUpdate = tasks.find(t => t.name === currentTask.name && t.time === currentTask.time);
        if (taskToUpdate) {
            taskToUpdate.removed = false; // 更新为未删除状态
        }
    }
    li.remove();
    addTaskToList(task);
    saveTask(task);
}

function getTaskFromLi(li) {
    const taskMatch = li.innerText.match(/^(.*)\s\((\d+)\s分钟\)$/);
    return {
        name: taskMatch[1],
        time: parseInt(taskMatch[2]),
        priority: getPriorityFromDotColor(li.querySelector('.dot').style.backgroundColor),
        isDaily: li.classList.contains('daily-task'),
        hidden: li.style.display === 'none'
    };
}

function getTaskListId(time) {
    return time <= 5 ? 'tasks5MinList' :
           time <= 10 ? 'tasks10MinList' :
           time <= 60 ? 'tasks1HourList' : 'tasksOver1HourList';
}

function getPriorityByIdx(idx) {
    return ['red', 'yellow', 'green', 'blue'][idx];
}

function getColorByPriority(priority) {
    return {
        red: '#ff4500',
        yellow: '#ffd700',
        green: '#32cd32',
        blue: '#4682b4'
    }[priority];
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const existingTaskIndex = tasks.findIndex(t => t.name === task.name && t.time === task.time);
    if (existingTaskIndex !== -1) {
        tasks[existingTaskIndex] = task; // 更新任务
    } else {
        tasks.push(task); // 添加新任务
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (!task.isDaily || !task.hidden) {
            addTaskToList(task);
        }
    });
}

function resetDailyTasks() {
    const dailyTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const tasksContainer = {
        5: document.getElementById('tasks5MinList'),
        10: document.getElementById('tasks10MinList'),
        60: document.getElementById('tasks1HourList'),
        10000: document.getElementById('tasksOver1HourList'),
    };

    Object.values(tasksContainer).forEach(container => container.innerHTML = '');
    dailyTasks.forEach(task => {
        if (task.isDaily && !task.hidden) {
            addTaskToList(task);
        }
    });
}
