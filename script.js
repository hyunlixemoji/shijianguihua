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
        const isDaily = document.getElementById('isDailyTask').checked; // 获取复选框状态

        if (name && !isNaN(time) && ['red', 'yellow', 'green', 'blue'].includes(priority)) {
            updateTask(currentLi, { name, time, priority, isDaily });
            closeEditPrompt();
        } else {
            alert('请填写有效的信息');
        }
    };

    document.getElementById('cancelEditButton').onclick = closeEditPrompt;
});

let currentLi; 

function closeEditPrompt() {
    document.getElementById('editTaskPrompt').style.display = 'none';
}

function showEditPrompt(li) {
    currentLi = li; 
    document.getElementById('editTaskName').value = li.innerText.split(' (')[0]; 
    document.getElementById('editTaskTime').value = parseInt(li.innerText.match(/\((\d+) 分钟\)/)[1]); 

    const dot = li.querySelector('.dot');
    const priority = getPriorityFromDotColor(dot.style.backgroundColor);
    document.getElementById('editTaskPriority').value = priority; 

    const isDaily = li.classList.contains('daily-task'); // 检查是否为日常任务
    document.getElementById('isDailyTask').checked = isDaily; // 设置复选框状态

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
            const task = { name: taskInput, time: timeInput, priority, isDaily: false }; // 默认非日常任务
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
    
    if (task.isDaily) { // 如果是日常任务，添加样式
        li.classList.add('daily-task');
    }

    li.oncontextmenu = (event) => {
        event.preventDefault(); 
        showEditPrompt(li); 
    };

    li.onclick = (event) => {
        if (event.detail === 2) { 
            li.style.textDecoration = 'line-through';
            setTimeout(() => {
                if (task.isDaily) {
                    li.remove();
                    removeTaskFromStorage(task);
                } else {
                    li.remove();
                    removeTaskFromStorage(task);
                }
            }, 2000);
        }
    };

    document.getElementById(listId).appendChild(li);
}

function updateTask(li, task) {
    // 移除原有的 li 元素
    const currentTask = getTaskFromLi(li); // 获取任务信息
    removeTaskFromStorage(currentTask); // 从存储中移除
    li.remove(); // 在界面上移除

    addTaskToList(task); // 添加新的 li 元素
    saveTask(task); // 更新存储
}

function getTaskFromLi(li) {
    const taskMatch = li.innerText.match(/^(.*)\s\((\d+)\s分钟\)$/);
    return {
        name: taskMatch[1],
        time: parseInt(taskMatch[2]),
        priority: getPriorityFromDotColor(li.querySelector('.dot').style.backgroundColor),
        isDaily: li.classList.contains('daily-task') // 检查是否为日常任务
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
        // 如果任务已经存在，更新它
        tasks[existingTaskIndex] = task;
    } else {
        // 添加新任务
        tasks.push(task);
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
        addTaskToList(task);
    });
}
