const USER = 'admin';
const PASSWORD = 'admin';

const taskInput = document.getElementById('new-task');
const dueDateInput = document.getElementById('due-date');
const taskList = document.getElementById('task-list');
const localStorageKey = 'taskList';

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('loggedIn') === 'true') {
    showTodoApp();
    loadTasks();
  }
});

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorBox = document.getElementById('login-error');

  if (username === USER && password === PASSWORD) {
    localStorage.setItem('loggedIn', 'true');
    errorBox.style.display = 'none';
    showTodoApp();
    loadTasks();
  } else {
    errorBox.style.display = 'block';
  }
}

function logout() {
  localStorage.removeItem('loggedIn');
  document.getElementById('todo-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'block';
}

function showTodoApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('todo-app').style.display = 'block';
}

function loadTasks() {
    taskList.innerHTML = "";
  const storedTasks = localStorage.getItem(localStorageKey);
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    tasks.forEach(task => {
      addTaskToDOM(task.text, task.finished, task.dueDate);
    });
  }
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('.list-group-item').forEach(item => {
    const span = item.querySelector('.task-text');
    const dueDate = item.getAttribute('data-due-date');
    tasks.push({
      text: span.textContent.split(' (Entrega:')[0],  // Salva só o texto puro
      finished: span.classList.contains('finished'),
      dueDate: dueDate
    });
  });
  localStorage.setItem(localStorageKey, JSON.stringify(tasks));
}

function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (taskText !== "" && dueDate !== "") {
    addTaskToDOM(taskText, false, dueDate);
    taskInput.value = "";
    dueDateInput.value = "";
    saveTasks();
  } else {
    alert('Por favor, preencha a tarefa e a data de entrega!');
  }
}

function addTaskToDOM(text, finished, dueDate) {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item');
  listItem.setAttribute('data-due-date', dueDate);

  const statusHTML = finished
    ? '<span class="status-ok">✅ OK</span>'
    : '<span class="status-ok" style="visibility: hidden;">✅ OK</span>';

  const formattedText = `${text} (Entrega: ${formatDate(dueDate)})`;

  listItem.innerHTML = `
    ${statusHTML}
    <span class="task-text ${finished ? 'finished' : ''}">${formattedText}</span>
    <div class="task-actions">
      <button class="btn btn-sm btn-warning" onclick="finishTask(this)">Finalizar</button>
      <button class="btn btn-sm btn-danger" onclick="removeTask(this)">Excluir</button>
    </div>
  `;

  taskList.appendChild(listItem);
}

function removeTask(button) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    const listItem = button.closest('.list-group-item');
    listItem.remove();
    saveTasks();
  }
}

function finishTask(button) {
  const listItem = button.closest('.list-group-item');
  const textSpan = listItem.querySelector('.task-text');
  const statusSpan = listItem.querySelector('.status-ok');

  textSpan.classList.toggle('finished');

  statusSpan.style.visibility = textSpan.classList.contains('finished') ? 'visible' : 'hidden';

  saveTasks();
}

function formatDate(dateStr) {
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`; // dd/mm/yyyy
}
