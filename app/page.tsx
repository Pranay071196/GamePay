"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [inputValue, setInputValue] = useState("");

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    if (inputValue.trim()) {
      client.models.Todo.create({
        content: inputValue.trim(),
        isDone: false,
      });
      setInputValue("");
    }
  }

  function toggleTodo(id: string, isDone: boolean) {
    client.models.Todo.update({
      id,
      isDone: !isDone,
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({
      id,
    });
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      createTodo();
    }
  }

  const activeTodos = todos.filter((todo) => !todo.isDone);
  const completedTodos = todos.filter((todo) => todo.isDone);

  return (
    <div className="app-container">
      <main className="todo-main">
        <header className="todo-header">
          <h1>My Tasks</h1>
          <p className="subtitle">
            {activeTodos.length} active, {completedTodos.length} completed
          </p>
        </header>

        <div className="input-section">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button onClick={createTodo} className="add-button">
            <span>+</span> Add
          </button>
        </div>

        <div className="todos-container">
          {activeTodos.length === 0 && completedTodos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create one to get started!</p>
            </div>
          ) : (
            <>
              {activeTodos.length > 0 && (
                <div className="section">
                  <h2 className="section-title">Active Tasks</h2>
                  <ul className="todo-list">
                    {activeTodos.map((todo) => (
                      <li key={todo.id} className="todo-item">
                        <button
                          className="checkbox"
                          onClick={() => toggleTodo(todo.id, todo.isDone || false)}
                          aria-label={`Mark "${todo.content}" as complete`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                        <span className="todo-text">{todo.content}</span>
                        <button
                          className="delete-button"
                          onClick={() => deleteTodo(todo.id)}
                          aria-label={`Delete "${todo.content}"`}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M2 2l14 14M16 2L2 16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {completedTodos.length > 0 && (
                <div className="section">
                  <h2 className="section-title completed-section-title">
                    Completed Tasks
                  </h2>
                  <ul className="todo-list completed">
                    {completedTodos.map((todo) => (
                      <li key={todo.id} className="todo-item completed-item">
                        <button
                          className="checkbox completed-checkbox"
                          onClick={() => toggleTodo(todo.id, todo.isDone || false)}
                          aria-label={`Mark "${todo.content}" as incomplete`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="9"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M6 10l3 3 5-5"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <span className="todo-text completed-text">
                          {todo.content}
                        </span>
                        <button
                          className="delete-button"
                          onClick={() => deleteTodo(todo.id)}
                          aria-label={`Delete "${todo.content}"`}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M2 2l14 14M16 2L2 16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
