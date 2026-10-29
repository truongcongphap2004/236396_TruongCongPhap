const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const Food = require('./models/Food');

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Ket noi MongoDB thanh cong!'))
  .catch(err => console.log('Loi ket noi MongoDB:', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// GET /api/foods (Xem & Tim kiem mon an)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const foods = await Food.find(query);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/foods (Them mon an)
app.post('/api/foods', async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/foods/:id (Cap nhat / Sua mon an)
app.put('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndUpdate(id, req.body, { new: true });
    if (!food) return res.status(404).json({ message: 'Khong tim thay mon an' });
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/foods/:id (Xoa mon an)
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);
    if (!food) return res.status(404).json({ message: 'Khong tim thay mon an' });
    res.json({ message: 'Xoa thanh cong' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
