const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); 

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Ket noi MongoDB thanh cong!'))
  .catch(err => console.log('Loi ket noi MongoDB:', err));


app.get('/', (req, res) => {
  res.send('Backend dang hoat dong!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend dang chay tren port ${PORT}`);
});