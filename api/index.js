const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;
const mongoUri = process.env.MONGO_URI || 'mongodb://mongodb:27017/todo';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const TodoSchema = new mongoose.Schema({
  content: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

app.use(bodyParser.json());
app.use(cors());

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).send(error);
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo({
      content: req.body.content,
      completed: req.body.completed || false
    });
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).send(error);
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send(error);
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
