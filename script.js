const todosList = document.querySelector(".todos-list");
const addTodoButton = document.querySelector(".add-todo");

const backgroundSelectorEl = document.querySelector(".background-selector");

const TODOS_KEY = "beginweb-todos-key";
const BG_IMG_KEY = "beginweb-bg-image";

backgroundSelectorEl.addEventListener("click", (e) => {
  const backgroundImg = e.target.style.backgroundImage;
  document.body.style.backgroundImage = backgroundImg;
  localStorage.setItem(BG_IMG_KEY, backgroundImg);
});

addTodoButton.addEventListener("click", (e) => {
  addTodo();
});

function addTodo() {
  const newId = Date.now();
  const newTodos = [
    ...appState.todos,
    {
      id: newId,
      text: "Untilited",
      completed: false,
    },
  ].sort((a, b) => a.completed - b.completed);

  updateTodos(newTodos);
  const createdTodoEl = document.querySelector(`[data-todo-id="${newId}"]`);
  createdTodoEl.querySelector(".todo-text").click();
  const inputEl = createdTodoEl.querySelector("input.todo-text");
  inputEl.select();
}

const appState = {
  todos: [
    {
      id: 1,
      text: "Learn JavaScript",
      completed: false,
    },
    {
      id: 2,
      text: "Learn React",
      completed: true,
    },
  ],
};

function updateTodos(newTodos) {
  appState.todos = newTodos;
  renderTodos();
  localStorage.setItem(TODOS_KEY, JSON.stringify(newTodos));
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

/** <div class="todo">
          <div class="todo-checkbox">
            <div class="todo-checkbox-circle"></div>
            <input type="checkbox" />
          </div>
          <p class="todo-text">Learn HTML</p>
          <button class="todo-delete">
            <i data-lucide="trash"></i>
          </button>
        </div> */
function createTodo(todo) {
  // TODO
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
    const newTodos = appState.todos
      .map((t) => {
        if (t.id === todo.id) {
          return {
            ...t,
            completed: !t.completed,
          };
        }
        return t;
      })
      .sort((a, b) => a.completed - b.completed);

    updateTodos(newTodos);
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
    const newTodos = appState.todos.map((t) => {
      if (t.id === todo.id) {
        return {
          ...t,
          text: value,
        };
      }
      return t;
    });
    updateTodos(newTodos);
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
    const newTodos = appState.todos.filter((t) => t.id !== todo.id);

    updateTodos(newTodos);
  });
  return buttonEl;
}

function initApp() {
  try {
    appState.todos = JSON.parse(localStorage.getItem(TODOS_KEY));
  } catch (e) {
    console.error("Catch");
  }
  renderTodos();
  document.body.style.backgroundImage = localStorage.getItem(BG_IMG_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Tout chargé");
  initApp();
});
