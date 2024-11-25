const todosList = document.querySelector(".todos-list");
const addTodoButton = document.querySelector(".add-todo");

const backgroundSelectorEl = document.querySelector(".background-selector");

const TODOS_KEY = "beginweb-todos-key2";
const BG_IMG_KEY = "beginweb-bg-image";

const backgroundImages = [
  "/images/background-1.jpg",
  "/images/background-2.jpg",
  "/images/background-3.jpg",
  "/images/background-4.jpg",
  "",
];

backgroundImages.forEach((img) => {
  const button = document.createElement("button");
  button.style.background = img ? `url('${img}')` : "hsl(0, 0%, 20%)";
  backgroundSelectorEl.appendChild(button);
});

backgroundSelectorEl.addEventListener("click", (e) => {
  const backgroundImg = e.target.style.backgroundImage;
  document.body.style.backgroundImage = backgroundImg;
  localStorage.setItem(BG_IMG_KEY, backgroundImg);
});

addTodoButton.addEventListener("click", (e) => {
  void addTodoEvent();
});

async function addTodoEvent() {
  const newTodo = await addTodoApi({
    completed: false,
    text: "Untilited",
  });

  setTimeout(() => {
    const createdTodoEl = document.querySelector(
      `[data-todo-id="${newTodo.id}"]`
    );
    createdTodoEl.querySelector(".todo-text").click();
    const inputEl = createdTodoEl.querySelector("input.todo-text");
    inputEl.select();
  }, 100);
}

const appState = {
  todos: [],
};

async function getTodosApi() {
  await new Promise((r) => setTimeout(r, 1000));
  const result = await fetch("http://localhost:3000/todos");

  if (!result.ok) {
    alert("Failed to fetch todo");
  }

  const json = await result.json();

  return json.todos;
}

async function updateTodoApi(todoId, newTodo) {
  const result = await fetch(`http://localhost:3000/todos/${todoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo: newTodo }),
  });

  if (!result.ok) {
    alert("Failed to fetch todo");
  }

  appState.todos = await getTodosApi();

  renderTodos();
}

async function deleteTodoApi(todoId) {
  const result = await fetch(`http://localhost:3000/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!result.ok) {
    alert("Failed to fetch todo");
  }

  appState.todos = await getTodosApi();

  renderTodos();
}

async function addTodoApi(newTodo) {
  const result = await fetch(`http://localhost:3000/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo: newTodo }),
  });

  if (!result.ok) {
    alert("Failed to fetch todo");
  }

  const json = await result.json();

  appState.todos = await getTodosApi();

  renderTodos();

  return json.todo;
}

function renderTodos() {
  document.startViewTransition(() => {
    todosList.innerHTML = "";
    for (const todo of appState.todos) {
      const todoEl = createTodo(todo);
      todosList.appendChild(todoEl);

      lucide.createIcons();
    }
  });
}

function createTodo(todo) {
  const todoEl = document.createElement("div");
  todoEl.setAttribute("data-todo-id", todo.id);
  todoEl.classList.add("todo");
  todoEl.style.viewTransitionName = `todo-${todo.id}`;
  if (todo.completed) {
    todoEl.classList.add("checked");
  }

  const checkbox = createCheckbox(todo);
  const text = createTextElement(todo);
  const trashButton = createDeleteButton(todo);
  todoEl.appendChild(checkbox);
  todoEl.appendChild(text);
  todoEl.appendChild(trashButton);

  return todoEl;
}

function createCheckbox(todo) {
  const todoCheckbox = document.createElement("div");
  const todoCheckboxCircle = document.createElement("div");
  const todoCheckboxInput = document.createElement("input");

  todoCheckboxInput.addEventListener("change", () => {
    const closestTodo = todoCheckbox.closest(".todo");
    const isCompleted = !todo.completed;
    closestTodo.classList.toggle("checked", isCompleted);
    updateTodoApi(todo.id, {
      completed: isCompleted,
    });
  });

  todoCheckbox.classList.add("todo-checkbox");
  todoCheckboxCircle.classList.add("todo-checkbox-circle");
  todoCheckboxInput.type = "checkbox";
  todoCheckbox.appendChild(todoCheckboxCircle);
  todoCheckbox.appendChild(todoCheckboxInput);
  return todoCheckbox;
}

function createTextElement(todo) {
  const textEl = document.createElement("p");
  const inputEl = document.createElement("input");
  inputEl.value = todo.text;
  inputEl.style.display = "none";

  textEl.addEventListener("click", () => {
    textEl.style.display = "none";
    inputEl.style.display = "block";
    inputEl.focus();
  });

  function editTodo(value) {
    updateTodoApi(todo.id, { text: value });
    textEl.innerText = value;
    textEl.style.display = "block";
    inputEl.style.display = "none";
  }

  inputEl.addEventListener("blur", (e) => {
    const value = e.target.value;
    editTodo(value);
  });
  inputEl.addEventListener("keydown", (e) => {
    e.key === "Enter" && editTodo(e.target.value);
  });

  textEl.classList.add("todo-text");
  inputEl.classList.add("todo-text");
  textEl.textContent = todo.text;
  const container = document.createElement("div");
  container.appendChild(textEl);
  container.appendChild(inputEl);
  container.classList.add("todo-text-container");
  return container;
}

function createDeleteButton(todo) {
  const buttonEl = document.createElement("button");
  const i = document.createElement("i");
  buttonEl.classList.add("todo-delete");
  i.setAttribute("data-lucide", "trash");
  buttonEl.appendChild(i);

  buttonEl.addEventListener("click", () => {
    deleteTodoApi(todo.id);
    const closestTodo = buttonEl.closest(".todo");
    closestTodo.remove();
  });
  return buttonEl;
}

async function initApp() {
  appState.todos = await getTodosApi();

  renderTodos();

  document.body.style.backgroundImage = localStorage.getItem(BG_IMG_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});
