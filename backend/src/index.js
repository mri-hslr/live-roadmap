require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const roadmapRoutes = require('./routes/roadmap');
const attachRealtime = require('./sockets/realtime');

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB(process.env.MONGO_URI || 'mongodb+srv://hslrsharmasingh:323112rm@cluster0.skwiapv.mongodb.net/').catch(err=>console.error(err));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

// attach socket handlers
attachRealtime(io);

// basic health
app.get('/', (req,res)=> res.send('Live Roadmap Backend'));

// start
const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=> console.log('Server listening on', PORT));
