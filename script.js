document.addEventListener('DOMContentLoaded', function() {
    // 加载已保存的任务
    loadTasks();

    document.getElementById('addTaskBtn').addEventListener('click', function() {
        const taskInput = document.getElementById('taskInput').value.trim();
        const timeInput = parseInt(document.getElementById('timeInput').value);

        if (taskInput && !isNaN(timeInput)) {
            // 创建新的待办事项
            const task = {
                name: taskInput,
                time: timeInput
            };
            addTaskToList(task);
            saveTask(task); // 保存任务到本地存储

            // 清空输入框
            document.getElementById('taskInput').value = '';
            document.getElementById('timeInput').value = '';
        } else {
            alert('请填写有效的待办事项和时间');
        }
    });
});

// 添加待办事项到相应列表
function addTaskToList(task) {
    let listId;

    // 根据时间分类
    if (task.time <= 5) {
        listId = 'tasks5MinList';
    } else if (task.time <= 10) {
        listId = 'tasks10MinList';
    } else if (task.time <= 60) {
        listId = 'tasks1HourList';
    } else {
        listId = 'tasksOver1HourList';
    }

    const li = document.createElement('li');
    li.textContent = task.name + ' (' + task.time + ' 分钟)';
    
    // 点击待办事项时标记为完成
    li.addEventListener('click', function() {
        li.style.textDecoration = 'line-through'; // 划去已完成事项
        setTimeout(() => li.remove(), 2000); // 2秒后移除
        removeTaskFromStorage(task); // 从本地存储中删除
    });

    // 添加到相应列表
    document.getElementById(listId).appendChild(li);
}

// 保存任务到本地存储
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 从本地存储中删除任务
function removeTaskFromStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.name !== task.name || t.time !== task.time);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 加载已保存的任务
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task));
}
