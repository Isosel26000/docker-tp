import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:3001/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      const response = await axios.post('http://localhost:3001/todos', { content: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:3001/todos/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditingText(todo.content);
  };

  const editTodo = async (id) => {
    const response = await axios.put(`http://localhost:3001/todos/${id}`, { content: editingText });
    setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    setEditingTodo(null);
    setEditingText('');
  };

  const toggleCompletion = async (todo) => {
    const response = await axios.put(`http://localhost:3001/todos/${todo._id}`, { completed: !todo.completed });
    setTodos(todos.map((t) => (t._id === todo._id ? response.data : t)));
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompletion(todo)}
            />
            {editingTodo === todo._id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <span>{todo.content}</span>
            )}
            <div className="todo-buttons">
              {editingTodo === todo._id ? (
                <button onClick={() => editTodo(todo._id)} className="edit-btn">Save</button>
              ) : (
                <button onClick={() => startEditing(todo)} className="edit-btn">Edit</button>
              )}
              <button onClick={() => deleteTodo(todo._id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
