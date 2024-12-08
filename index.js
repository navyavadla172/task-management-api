const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();  // This loads the environment variables from .env file


// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection string
const mongoURI = "mongodb+srv://niharikavadla172:90Q4ro3gCvg82q5W@cluster0.dmhlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Define a Task model (if you're using a task list or something similar)
const Task = mongoose.model('Task', new mongoose.Schema({
    name: String,
    description: String,
    dueDate: Date
  }));
  

// Example route: Home page
app.get('/', (req, res) => {
  res.send('Welcome to Task Management Api!!!');
});

// Example route to fetch all tasks
app.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.find(); // Fetch tasks from MongoDB
      res.json(tasks); // Return tasks as JSON
    } catch (err) {
      console.log('Error fetching tasks:', err); // Log error to console
      res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
    }
  });
  
// Example route to add a new task (POST)
app.post('/tasks', async (req, res) => {
  const task = new Task({
    name: req.body.name,
    description: req.body.description,
    dueDate: req.body.dueDate,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        // Ensure valid MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});


app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure valid MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});



// Server setup
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
