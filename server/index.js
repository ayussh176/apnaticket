require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

const { securityMiddleware } = require('./middleware/security');
securityMiddleware(app);

app.use('/api/auth', authRoutes);
const bookingRoutes = require('./routes/book');
app.use('/api/book', bookingRoutes);
const walletRoutes = require('./routes/wallet');
app.use('/api/wallet', walletRoutes);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
