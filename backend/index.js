const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

const PORT = 3000;

app.use(cors());

app.use(express.static('public'));

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
