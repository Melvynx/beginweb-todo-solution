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
