const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const Food = require('./models/Food'); // Nhập model Food

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Ket noi MongoDB thanh cong!'))
  .catch(err => console.log('Loi ket noi MongoDB:', err));

// --- BẮT ĐẦU CÁC API ---

// API 1: Lấy danh sách tất cả món ăn (GET)
app.get('/api/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API 2: Thêm một món ăn mới (POST)
app.post('/api/foods', async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- KẾT THÚC CÁC API ---

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend dang chay tren port ${PORT}`);
});