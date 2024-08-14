const express = require('express');
const router = express.Router();

// Function to create routes with db connection
module.exports = function (db) {
  // Get available mentors
  router.get('/mentors', (req, res) => {
    db.query('SELECT * FROM mentors', (err, results) => {
      if (err) {
        console.error('Error fetching mentors:', err);
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });

  // Get students
  router.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
      if (err) {
        console.error('Error fetching students:', err);
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });

  // Schedule a session
  router.post('/schedule', (req, res) => {
    const { student_id, mentor_id, start_time, end_time, duration, premium_service } = req.body;
    const query = 'INSERT INTO sessions (student_id, mentor_id, start_time, end_time, duration, premium_service) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [student_id, mentor_id, start_time, end_time, duration, premium_service], (err, result) => {
      if (err) {
        console.error('Error scheduling session:', err);
        return res.status(500).send(err);
      }
      res.json({ id: result.insertId });
    });
  });

  // Get payment details
  router.get('/payment', (req, res) => {
    const { duration, premium_service } = req.query;

    // Define pricing
    const pricing = {
      30: 2000,
      45: 3000,
      60: 4000
    };

    let amount = pricing[duration] || 0;
    if (premium_service === 'true') {
      amount += 1000;  // Additional charge for premium service
    }

    res.json({ amount });
  });

  // Process payment
  router.post('/payment', (req, res) => {
    const { session_id, amount, status } = req.body;

    // Simulate payment processing
    if (status === 'success') {
      const query = 'INSERT INTO payments (session_id, amount, status) VALUES (?, ?, ?)';
      db.query(query, [session_id, amount, status], (err, result) => {
        if (err) {
          console.error('Error processing payment:', err);
          return res.status(500).send(err);
        }
        res.json({ success: true, paymentId: result.insertId });
      });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  });

  return router;
};
