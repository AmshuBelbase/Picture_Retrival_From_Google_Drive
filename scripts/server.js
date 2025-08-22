// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const { ensureCache } = require('./driveImages');

const app = express();
app.use(cors());
app.use(express.json());

// Serve test page
// app.use(express.static(path.join(__dirname, 'public')));

// static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api', routes);

// Eagerly warm cache before accepting requests (optional but nice)
(async () => {
  try {
    await ensureCache();
    console.log('Drive cache warmed.');
  } catch (e) {
    console.warn('Cache warm failed, will lazy-load on first request:', e.message);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
})();


// {
//   "name": "pic_from_drive",
//   "version": "1.0.0",
//   "description": "",
//   "main": "list_drive_images.js",
//   "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
//   "keywords": [],
//   "author": "",
//   "license": "ISC",
//   "dependencies": {
//     "googleapis": "^105.0.0"
//   }
// }