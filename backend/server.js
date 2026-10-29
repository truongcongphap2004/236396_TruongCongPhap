const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Phuc vu file tinh tu thu muc frontend
app.use(express.static(path.join(__dirname, '../frontend')));

const Food = require('./models/Food');

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Ket noi MongoDB thanh cong!'))
  .catch(err => console.log('Loi ket noi MongoDB:', err));

// Dinh tuyen trang chu hien thi giao dien index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/foods', async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
