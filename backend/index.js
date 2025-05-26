const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const pool = require('./db');


const PORT = 3000;

app.use(cors());

app.use(express.static('public'));
app.use(express.json()); // To parse JSON body


app.get('/api/fires', async (req, res) => {
  const { date, days } = req.query;

  try {
    const response = await axios.get(
      `https://firms.modaps.eosdis.nasa.gov/api/country/csv/d65be8a1fc863f580015626403478862/MODIS_NRT/AUS/${days || 1}/${date || new Date().toISOString().split("T")[0]}`
    );

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fire data' });
  }
});
app.post('/api/notify', (req, res) => {
  // You can trigger your email/SMS logic here
  console.log('📢 Notifications sent to fire centers');
  res.json({ message: 'Notifications sent to all fire centers.' });
});


app.post('/register', async (req, res) => {
  const {
    name, state, location, email, phone,
    mobile, fax, password, status, description
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO "fireCenters"
      (name, email, phone, mobile, state, location, password, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [name,email, phone, mobile, state, location, password, status]
    );

    res.json({ message: '✅ Fire center registered successfully!', centerId: result.rows[0].id });
  } catch (err) {
    console.error('❌ Error saving to DB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', (req, res) => {
  
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
