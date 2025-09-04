require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const DocumentSchema = new mongoose.Schema({
  content: String,
});

const Document = mongoose.model('Document', DocumentSchema);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join-document', async (docId) => {
    socket.join(docId);
    let document = await Document.findById(docId);
    if (!document) {
      document = await Document.create({ _id: docId, content: '' });
    }
    socket.emit('load-document', document.content);
  });

  socket.on('send-changes', (docId, newContent) => {
    socket.to(docId).emit('receive-changes', newContent);
  });

  socket.on('save-document', async (docId, data) => {
    await Document.findByIdAndUpdate(docId, { content: data });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

