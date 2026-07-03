import app from './src/app.js';
import connectDB from './src/config/db.js';
import dns from 'node:dns/promises'
dns.setServers(['8.8.8.8', '1.1.1.1'])
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});