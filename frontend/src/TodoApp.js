import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post('http://localhost:3001/todos', { content: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    setEditTodo(todo);
    setEditContent(todo.content);
  };

  const updateTodo = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/todos/${editTodo._id}`, { content: editContent });
      setTodos(todos.map(todo => (todo._id === editTodo._id ? response.data : todo)));
      setEditTodo(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {editTodo && editTodo._id === todo._id ? (
              <>
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={updateTodo}>Save</button>
                <button onClick={() => setEditTodo(null)}>Cancel</button>
              </>
            ) : (
              <>
                {todo.content}
                <button onClick={() => startEditing(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
