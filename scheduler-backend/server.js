const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Default MySQL root password
  database: 'scheduler'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('MySQL connected...');
});

// Define routes
const routes = require('./routes'); // Import routes here
app.use('/api', routes(db)); // Pass db as argument

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
