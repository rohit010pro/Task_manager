const inputTask = document.querySelector('#input_task'),
tasklist = document.querySelector('.task_list'),
addFormBtn = document.querySelector('#showAddBtn'),
addForm = document.querySelector('.add_task');

var isEdit = false;
var editId = 0;

// Display Task
const showTasks = () => {
    const allTask = JSON.parse(localStorage.getItem('tasks'));

    let html = `<h3>Task List</h3>`;

    if (allTask === null) {
        html += `<div class="empty">No task to show</div>`;
    } else {
        for (let i = 0; i < allTask.length; i++) {
            html +=
                `
            <div class="task">
                <h4>${allTask[i].taskTitle}</h4>
                <button class="edit" onclick="editTask(${allTask[i].id},'${allTask[i].taskTitle}')">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="delete" onclick="deleteTask(${allTask[i].id})">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>`;
        }
    }
    tasklist.innerHTML = html;
}

// Adding Task
const addTask = (e) => {
    if(e.key != "Enter")
        return;
    let taskTitle = htmlEntities(inputTask.value.trim());

    let parent = inputTask.parentElement;

    if (taskTitle === "") {
        parent.classList.add('error');
        return;
    } else
        parent.classList.remove('error');

    const allTask = JSON.parse(localStorage.getItem('tasks'));
    let updatedTask;

    if(isEdit){
        for (let i = 0; i < allTask.length; i++) {
            if(allTask[i].id == editId)
                allTask[i].taskTitle = taskTitle;
        }
        isEdit = false;
        updatedTask = allTask;
    }else{
        let id = allTask === null ? 1 : allTask.length + 1;

        let newtask = { id, taskTitle };
        if (allTask === null)
            updatedTask = [newtask];
        else
            updatedTask = [...allTask, newtask];
    }

    localStorage.setItem("tasks", JSON.stringify(updatedTask));

    inputTask.value = '';
    showTasks();
}

// Editing Task
const editTask = (id, taskTitle) => {
    inputTask.value = taskTitle;
    isEdit = true;
    editId = id;
    addForm.classList.add('show');
    addFormBtn.classList.add('rotate');
}

// Deleting Task
const deleteTask = (id) => {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    
    let result = tasks.filter((task)=>{
        if(task.id !== id)
            return task;
    });

    if(result.length == 0) result = null;

    localStorage.setItem("tasks", JSON.stringify(result));
    showTasks();
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

addFormBtn.addEventListener('click', () => {
    addForm.classList.toggle('show');
    addFormBtn.classList.toggle('rotate');
});

inputTask.addEventListener('input', () => {
    let parent = inputTask.parentElement;
    parent.classList.remove('error');
});

showTasks();
inputTask.addEventListener('keyup', addTask);
