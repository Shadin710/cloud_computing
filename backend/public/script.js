const australiaBounds = L.latLngBounds(
    [-44, 112],  // Southwest
    [-10, 154]   // Northeast
  );
  
  const map = L.map('map', {
    maxBounds: australiaBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 4,
    maxZoom: 10
  }).setView([-25.2744, 133.7751], 5);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  async function loadFireData() {
    const today = new Date().toISOString().split("T")[0];
    const days = 1; // Or grab from a filter input

    try {
      const res = await fetch(`/api/fires?date=${today}&days=${days}`);
      const csv = await res.text();
  
      const lines = csv.split('\n').slice(1); // skip header
      for (let line of lines) {
        const fields = line.split(',');
        const latitude = parseFloat(fields[1]);
        const longitude = parseFloat(fields[2]);
        const confidence = parseInt(fields[10]);
        const brightness = fields[12];
        const date = fields[6];

        
        // console.log(fields);
  
        if (!latitude || !longitude || confidence < 85) continue;
  
        L.circleMarker([parseFloat(latitude), parseFloat(longitude)], {
          radius: 6,
          fillColor: "red",
          color: "darkred",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        })
        .addTo(map)
        .bindPopup(`🔥 Fire<br>Confidence: ${confidence}%`);
      }
    } catch (err) {
      console.error('Failed to load fire data:', err);
    }
  }
  document.getElementById('notifyBtn').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/notify', { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'Notifications sent!');
    } catch (err) {
      alert('Failed to send notifications.');
      console.error(err);
    }
  });

loadFireData();
