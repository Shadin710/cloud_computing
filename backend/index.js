// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/fires', async (req, res) => {
  try {
    const response = await axios.get(
      'https://firms.modaps.eosdis.nasa.gov/api/country/csv/VIIRS_SNPP_NRT/Australia/1/your_api_key'
    );
    // You'll need to parse the CSV or use JSON API if available
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fire data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
