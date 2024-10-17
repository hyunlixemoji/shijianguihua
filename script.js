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
        const count = parseInt(document.getElementById('editTaskCount').value);
        const priority = document.getElementById('editTaskPriority').value;
        const isDaily = document.getElementById('isDailyTask').checked;

        if (name && !isNaN(time) && !isNaN(count) && ['red', 'yellow', 'green', 'blue'].includes(priority)) {
            updateTask(currentLi, { name, time, priority, isDaily, count });
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

    const isDaily = li.classList.contains('daily-task'); 
    document.getElementById('isDailyTask').checked = isDaily; 

    const countMatch = li.innerText.match(/x(\d+)/);
    document.getElementById('editTaskCount').value = countMatch ? countMatch[1] : 1;

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
            const task = { name: taskInput, time: timeInput, priority, isDaily: false, count: 1 }; 
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
    li.innerHTML = `<span class="dot" style="background-color: ${getColorByPriority(task.priority)};"></span>${task.name} (${task.time} 分钟) x${task.count}`;

    if (task.isDaily) {
        li.classList.add('daily-task');
    }

    li.oncontextmenu = (event) => {
        event.preventDefault(); 
        showEditPrompt(li); 
    };

    li.ondblclick = (event) => {
        handleTaskCompletion(li, task);
    };

    document.getElementById(listId).appendChild(li);
}

function handleTaskCompletion(li, task) {
    if (task.count > 0) {
        task.count--;
        li.innerHTML = li.innerHTML.replace(/x(\d+)/, `x${task.count}`);
        saveTask(task); // 更新本地存储
    }

    if (task.count === 0) {
        li.remove();
        removeTaskFromStorage(task);
    }
}

function updateTask(li, task) {
    const currentTask = getTaskFromLi(li); 
    removeTaskFromStorage(currentTask); 
    li.remove(); 

    addTaskToList(task); 
    saveTask(task); 
}

function getTaskFromLi(li) {
    const taskMatch = li.innerText.match(/^(.*)\s\((\d+)\s分钟\)\s*x(\d+)$/);
    return {
        name: taskMatch[1],
        time: parseInt(taskMatch[2]),
        priority: getPriorityFromDotColor(li.querySelector('.dot').style.backgroundColor),
        isDaily: li.classList.contains('daily-task'),
        count: parseInt(taskMatch[3])
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
        addTaskToList(task);
    });
}
