document.addEventListener('DOMContentLoaded', function () {
    loadTasksFromLocalStorage('todo-container');
    loadTasksFromLocalStorage('todo-container2');
    loadTasksFromLocalStorage('done-container');
});

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    if (event.target.classList.contains('container')) {
        event.target.querySelector('div').appendChild(draggedElement);
    } else {
        event.target.appendChild(draggedElement);
    }

    draggedElement.classList.toggle('done', event.target.id === 'done-container');

    saveTasksToLocalStorage('todo-container');
    saveTasksToLocalStorage('todo-container2');
    saveTasksToLocalStorage('done-container');
}

function addTask(containerId) {
    const taskText = document.activeElement.innerText;
    if (taskText.trim() !== '') {
        const container = document.getElementById(containerId);
        const task = document.createElement('div');
        task.id = 'task-' + new Date().getTime();
        task.className = 'task';
        task.draggable = true;
        task.addEventListener('dragstart', drag);
        task.innerText = taskText;
        container.querySelector('div').appendChild(task);
        document.activeElement.innerText = '';

        saveTasksToLocalStorage(containerId);
        saveTasksToLocalStorage('done-container');
    }
}

document.getElementById('new-task').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask('todo-container');
    }
});

document.getElementById('new-task2').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask('todo-container2');
    }
});

// function addStickyNote() {
//     const noteText = document.getElementById('new-sticky-note').innerText.trim();
//     if (noteText) {
//         const notesContainer = document.getElementById('sticky-notes-list');
//         const note = document.createElement('div');
//         note.id = 'note-' + new Date().getTime();
//         note.className = 'sticky-note';
//         note.draggable = true;
//         note.addEventListener('dragstart', drag);
//         note.innerHTML = noteText;
//         notesContainer.appendChild(note);
//         document.getElementById('new-sticky-note').innerText = '';
//     }
// }

function resizeTextarea(element) {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
}

function deleteTask(event) {
    event.preventDefault();
    const taskElement = event.target.closest('.task');
    if (taskElement) {
        taskElement.parentNode.removeChild(taskElement);

        saveTasksToLocalStorage('todo-container');
        saveTasksToLocalStorage('todo-container2');
        saveTasksToLocalStorage('done-container');
    }
}

document.addEventListener('contextmenu', function (event) {
    if (event.target.classList.contains('task')) {
        deleteTask(event);
    }
});

let timerInterval;

function startTimer() {
    const hours = parseInt(document.getElementById('hours').value, 10) || 0;
    const minutes = parseInt(document.getElementById('minutes').value, 10) || 0;

    let totalTime = (hours * 60 * 60 + minutes * 60) * 1000;

    timerInterval = setInterval(function () {
        if (totalTime <= 0) {
            stopTimer();
            document.getElementById('timer').innerText = 'Timer Expired!';
        } else {
            const hoursLeft = Math.floor(totalTime / (60 * 60 * 1000));
            const minutesLeft = Math.floor((totalTime % (60 * 60 * 1000)) / (60 * 1000));
            const secondsLeft = Math.floor((totalTime % (60 * 1000)) / 1000);

            document.getElementById('timer').innerText = `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
            totalTime -= 1000;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function loadTasksFromLocalStorage(containerId) {
    const container = document.getElementById(containerId);
    const tasks = JSON.parse(localStorage.getItem(containerId)) || [];

    tasks.forEach((taskText) => {
        const task = document.createElement('div');
        task.id = 'task-' + new Date().getTime();
        task.className = 'task';
        task.draggable = true;
        task.addEventListener('dragstart', drag);
        task.innerText = taskText;

        if (containerId === 'done-container') {
            task.classList.add('done');
        }

        container.querySelector('div').appendChild(task);
    });
}

function saveTasksToLocalStorage(containerId) {
    const container = document.getElementById(containerId);
    const tasks = Array.from(container.querySelectorAll('.task')).map(task => task.innerText.trim());
    localStorage.setItem(containerId, JSON.stringify(tasks));
}