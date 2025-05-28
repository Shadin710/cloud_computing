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
// POST: Send notification by fire center ID
app.post('/api/notify-center/:id', async (req, res) => {
  const centerId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM "fireCenters" WHERE id = $1', [centerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fire center not found.' });
    }
    
    const center = result.rows[0];
    if (!center.mobile) {
      return res.status(400).json({ message: 'No mobile number available for this center.' });
    }

    // Sms content
    const smsPayload = {
            "phone": "+61479060864",
            "message": "🚨 Fire alert near your station. Please respond immediately"
    };

    // Email content
    const emailPayload = {
      to: center.email,
      subject: `🚨 Fire Alert Notification - ${center.name}`,
      text: `Dear ${center.name},\n\nA fire incident has been detected in your region.\n\nLocation: ${center.location}\n\nPlease take appropriate action.\n\n- FireApp Australia`
    };

    // Send email via Node-RED
    await axios.post('http://localhost:1880/send-email', emailPayload);
    await axios.post('http://localhost:1880/send-msg', smsPayload);


    res.json({ message: `Notification sent to ${center.name}` });

  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({ message: 'Failed to send notification.' });
  }
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM "fireCenters" WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    // const match = await bcrypt.compare(password, user.password);

    if (password != user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Return user info (or token in real apps)
    res.status(200).json({
      message: `Welcome back, ${user.name}!`,
      user: {
        name: user.name,
        email: user.email,
        location: user.location,
        id: user.id
      }
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});
app.post('/admin_login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM "admin_login" WHERE name = $1', [name]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid name or password.' });
    }

    const user = result.rows[0];
    // const match = await bcrypt.compare(password, user.password);

    if (password != user.password) {
      return res.status(401).json({ message: 'Invalid name or password.' });
    }

    // Return user info (or token in real apps)
    res.status(200).json({
      message: `Welcome back, ${user.name}!`,
      user: {
        name: user.name,
        id: user.id
      }
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

//fire centers data
app.get('/api/fire-centers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "fireCenters" ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching fire centers:', err);
    res.status(500).json({ message: 'Failed to fetch fire centers' });
  }
});
// deleting fire centers

app.delete('/api/fire-centers/:id', async (req, res) => {
  const centerId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM "fireCenters" WHERE id = $1', [centerId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Fire center not found.' });
    }

    res.json({ message: 'Fire center deleted successfully.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete fire center.' });
  }
});

// getting the fire centers
app.get('/api/fire-centers/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'active') AS active,
        COUNT(*) FILTER (WHERE status = 'inactive') AS inactive
      FROM "fireCenters"
    `);

    const stats = result.rows[0];
    res.json({
      total: parseInt(stats.total),
      active: parseInt(stats.active),
      inactive: parseInt(stats.inactive)
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Failed to fetch fire center stats.' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
