// Filename: server.js

const express = require('express');
const path = require('path');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Use CORS to allow cross-origin requests (useful for local development)
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Placeholder for additional API routes
// e.g., app.use('/api/geodata', require('./routes/geodata'));

// Catch-all route to serve the Vue.js application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
