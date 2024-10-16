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

    // 每天重置日常任务
    setInterval(resetDailyTasks, 24 * 60 * 60 * 1000); // 每天检查
    resetDailyTasks(); // 页面加载时也检查
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
    const dot = li.querySelector('.dot');
    const priority = getPriorityFromDotColor(dot.style.backgroundColor);
    document.getElementById('editTaskPriority').value = priority;
    document.getElementById('editTaskDaily').value = task.isDaily ? 'yes' : 'no';

    document.getElementById('editTaskPrompt').style.display = 'block';
}

function getPriorityFromDotColor(color) {
    if (color === 'rgb(255, 69, 0)') return 'red';
    if (color === 'rgb(255, 215, 0)') return 'yellow';
    if (color === 'rgb(50, 205, 50)') return 'green';
    if (color === 'rgb(70, 130, 180)') return 'blue';
    return 'red';
}

function showPriorityPrompt(taskInput, timeInput) {
    const promptBox = document.getElementById('priorityPrompt');
    promptBox.style.display = 'block';
    const priorityButtons = document.querySelectorAll('#priorityPrompt button');
    priorityButtons.forEach((button, idx) => {
        button.onclick = (() => {
            const priority = getPriorityByIdx(idx);
            const task = { name: taskInput, time: timeInput, priority, isDaily: false }; // 默认不设置为日常任务
            addTaskToList(task);
            saveTask(task);
            document.getElementById('taskInput').value = '';
            document.getElementById('timeInput').value = '';
            promptBox.style.display = 'none';
        });
    });
}

function addTaskToList(task) {
    const listId = getTaskListId(task.time);
    const li = document.createElement('li');
    li.innerHTML = `<span class="dot" style="background-color: ${getColorByPriority(task.priority)};"></span>${task.name} (${task.time} 分钟)`;
    
    if (task.isDaily) {
        li.classList.add('daily-task'); // 添加日常任务样式
    }

    li.oncontextmenu = (event) => {
        event.preventDefault(); 
        showEditPrompt(li); 
    };

    li.ondblclick = (event) => {
        if (!task.isDaily) {
            removeTask(task); // 非日常任务直接移除
        } else {
            li.style.display = 'none'; // 隐藏日常任务
            markTaskAsRemoved(task); // 标记日常任务为隐藏
        }
    };

    document.getElementById(listId).appendChild(li);
}

function markTaskAsRemoved(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToUpdate = tasks.find(t => t.name === task.name && t.time === task.time);
    if (taskToUpdate) {
        taskToUpdate.hidden = true; // 增加 hidden 属性表示已被隐藏
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function removeTask(task) {
    removeTaskFromStorage(task); // 从存储中移除非日常任务
    const listItem = Array.from(document.querySelectorAll('li')).find(li => li.innerText.includes(task.name) && li.innerText.includes(`${task.time} 分钟`));
    if (listItem) listItem.remove();
}

function updateTask(li, task) {
    const currentTask = getTaskFromLi(li); 
    if (!currentTask.isDaily) {
        removeTaskFromStorage(currentTask); 
    } // 对非日常任务做处理
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
        isDaily: li.classList.contains('daily-task'),  // 判断是否为日常任务
        hidden: li.style.display === 'none'  // 判断当前任务是否被隐藏
    };
}

function getTaskListId(time) {
    return time <= 5 ? 'tasks5MinList' :
           time <= 10 ? 'tasks10MinList' :
           time <= 60 ? 'tasks1HourList' : 'tasksOver1HourList';
}

function getPriorityByIdx(idx) {
    const priorities = ['red', 'yellow', 'green', 'blue'];
    return priorities[idx];
}

function getColorByPriority(priority) {
    switch (priority) {
        case 'red': return '#ff4500';
        case 'yellow': return '#ffd700';
        case 'green': return '#32cd32';
        case 'blue': return '#4682b4';
        default: return '#000';
    }
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

function removeTaskFromStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => !(t.name === task.name && t.time === task.time));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (!task.hidden) { // 只加载未被隐藏的任务
            addTaskToList(task);
        }
    });
}

function resetDailyTasks() {
    const dailyTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentDate = new Date().toISOString().slice(0, 10); // 获取当前日期
    const tasksContainer = {
        5: document.getElementById('tasks5MinList'),
        10: document.getElementById('tasks10MinList'),
        60: document.getElementById('tasks1HourList'),
        10000: document.getElementById('tasksOver1HourList'),
    };

    // 清空任务列表
    for (const key in tasksContainer) {
        tasksContainer[key].innerHTML = '';
    }

    dailyTasks.forEach(task => {
        if (task.isDaily && !task.hidden) { // 判断日常任务且未被隐藏
            addTaskToList(task);
        }
    });
}
