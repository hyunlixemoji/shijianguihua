body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background: url('龟兔赛跑.png') repeat;
    background-size: 10%; /* 将背景图缩小为10% */
}

.container, .quadrant-container {
    display: flex; 
    justify-content: center; 
    align-items: stretch; /* 尽可能拉伸对齐 */
    flex-wrap: wrap;
}

#title-container {
    display: flex; 
    justify-content: center; 
    align-items: center; 
    margin-top: 50px; 
    flex-wrap: nowrap;
}

#title {
    color: #f8f0e3; 
    text-shadow: 1px 1px 0 #4b0082; 
    margin: 0; 
    padding-right: 5px; 
    font-size: 2em; 
    white-space: nowrap; 
}

input { 
    width: 100%; 
    max-width: 200px; 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 5px; 
    margin-right: 10px; 
}

button { 
    width: 60px; 
    height: 60px; 
    border-radius: 50%; 
    background-color: #ffb6c1; 
    color: white; 
    cursor: pointer; 
    transition: background-color 0.3s; 
    border: none; 
}

button:hover { 
    background-color: #ff69b4; 
}

.quadrant-container { 
    min-height: 400px; 
    gap: 20px; 
}

.quadrant { 
    box-sizing: border-box; 
    width: calc(45% - 20px); 
    min-height: 180px; 
    padding: 10px; 
    display: flex;                   /* 设置成flex布局 */
    flex-direction: column;         /* 垂直排列 */
    justify-content: space-between; /* 确保内容均匀分布 */
    border-radius: 15px;           /* 圆角 */
}

#q1 { 
    background-color: #ffe4e1; 
}

#q2 { 
    background-color: #e6e6fa; 
}

#q3 { 
    background-color: #f0e68c; 
}

#q4 { 
    background-color: #add8e6; 
}

ul { 
    list-style: none; 
    padding: 0; 
}

/* 修改: li使用flex布局支持自动换行 */
li { 
    cursor: pointer; 
    margin: 5px 0; 
    display: block; /* 使用block布局以支持换行 */
    word-wrap: break-word; /* 允许后内容断行 */
    max-width: 100%; /* 确保待办事项自动换行 */
}

.dot { 
    margin-right: 10px; 
}

#tasks5MinList { color: #FFA07A; }
#tasks10MinList { color: #FFA500; }
#tasks1HourList { color: #FF6347; }
#tasksOver1HourList { color: #C71585; }

.quadrant h3 { 
    margin-top: 5px; 
}

@media (max-width: 600px) {
    body { margin: 10px; }
    #title-container { flex-direction: column; align-items: center; }
    #title { font-size: 1.5em; }
    .title-image { width: 100%; }
    input { width: calc(100% - 22px); margin-right: 0; }
    button { width: 50px; height: 50px; }
    .quadrant { width: 100%; margin: 10px 0; }
    .quadrant-container { flex-direction: column; }
}

.priority-button { 
    width: 100%; 
    padding: 10px; 
    margin: 5px 0; 
    border: none; 
    color: white; 
    cursor: pointer; 
    font-size: 16px; 
    border-radius: 10px; 
    transition: background-color 0.3s; 
}

.priority-button.red { background-color: #ff4500; }
.priority-button.yellow { background-color: #ffd700; }
.priority-button.green { background-color: #32cd32; }
.priority-button.blue { background-color: #4682b4; }

.priority-button:hover { 
    opacity: 0.8; 
}
