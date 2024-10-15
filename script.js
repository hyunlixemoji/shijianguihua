document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const taskInput = document.getElementById('taskInput').value.trim();
        const timeInput = parseInt(document.getElementById('timeInput').value);
        if (taskInput && !isNaN(timeInput)) showPriorityPrompt(taskInput, timeInput);
        else alert('请填写有效的待办事项和时间');
    });

    // 添加双击事件修改
    document.querySelectorAll('.quadrant li').forEach(li => {
        li.oncontextmenu = (event) => {
            event.preventDefault(); // 防止右键菜单
            
            // 显示编辑弹出框
            const editPrompt = document.getElementById('editTaskPrompt');
            editPrompt.style.display = 'block';

            // 填充编辑框
            document.getElementById('editTaskName').value = li.innerText.split(' (')[0]; // 获取任务内容
            document.getElementById('editTaskTime').value = li.innerText.split('(')[1].split('分钟')[0]; // 获取时间
            let priorityClass;
            const dot = li.querySelector('.dot');
            if (dot.style.backgroundColor === 'rgb(255, 69, 0)') priorityClass = 'red';
            else if (dot.style.backgroundColor === 'rgb(255, 215, 0)') priorityClass = 'yellow';
            else if (dot.style.backgroundColor === 'rgb(50, 205, 50)') priorityClass = 'green';
            else if (dot.style.backgroundColor === 'rgb(70, 130, 180)') priorityClass = 'blue';
            document.getElementById('editTaskPriority').value = priorityClass; // 设置优先级

            // 保存引用到当前li元素用于更新
            editPrompt.dataset.currentLi = li.outerHTML; // 保存原始DOM用于后续更新
        };
    });

    document.getElementById('saveEditButton').onclick = () => {
        const name = document.getElementById('editTaskName').value;
        const time = parseInt(document.getElementById('editTaskTime').value);
        const priority = document.getElementById('editTaskPriority').value;

        // 找到当前要更新的li元素
        const liElements = document.querySelectorAll('.quadrant li');
        let currentLi;
        liElements.forEach(li => {
            if (li.outerHTML === editPrompt.dataset.currentLi) {
                currentLi = li; // 找到对应的li元素
            }
        });

        const dotClass = priority; // 使用选择的优先级

        if (name && !isNaN(time) && ['red', 'yellow', 'green', 'blue'].includes(dotClass)) {
            updateTask(currentLi, { name, time, dotClass }); // 更新待办事项
            saveTask({ name, time, dotClass }); // 同步更新本地存储
            document.getElementById('editTaskPrompt').style.display = 'none'; // 关闭弹窗
        } else {
            alert('请填写有效的信息');
        }
    };

    // 取消编辑
    document.getElementById('cancelEditButton').onclick = () => {
        document.getElementById('editTaskPrompt').style.display = 'none';
    };
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
    li.innerHTML = `<span class="dot" style="background-color: ${getColorByPriority(task.dotClass)};"></span>${task.name} (${task.time} 分钟)`;
    li.style.wordWrap = 'break-word';  // 支持自动换行

    li.onclick = (event) => {
        if (event.detail === 2) { // 双击事件
            li.style.textDecoration = 'line-through';
            setTimeout(() => li.remove(), 2000);
            removeTaskFromStorage(task);
        }
    };

    document.getElementById(listId).appendChild(li);
}

function updateTask(li, task) {
    li.innerHTML = `<span class="dot" style="background-color: ${getColorByPriority(task.dotClass)};"></span>${task.name} (${task.time} 分钟)`;
}

function getColorByPriority(dotClass) {
    switch (dotClass) {
        case 'red': return '#ff4500';
        case 'yellow': return '#ffd700';
        case 'green': return '#32cd32';
        case 'blue': return '#4682b4';
        default: return '#000';
    }
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
