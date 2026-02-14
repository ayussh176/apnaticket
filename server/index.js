require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
const bookingRoutes = require('./routes/book');
app.use('/api/book', bookingRoutes);
const walletRoutes = require('./routes/wallet');
app.use('/api/wallet', walletRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
