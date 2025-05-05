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
  try {
    const res = await fetch('/api/fires');
    const data = await res.text(); // If CSV, parse here
    const lines = data.split('\n').slice(1); // Skip CSV header

    for (let line of lines) {
      const fields = line.split(',');
      const [latitude, longitude, confidence] = [fields[0], fields[1], fields[8]];

      if (parseInt(confidence) > 85) {
        L.circleMarker([latitude, longitude], {
          radius: 6,
          fillColor: "red",
          color: "darkred",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map).bindPopup(`🔥 Confidence: ${confidence}%`);
      }
    }
  } catch (err) {
    console.error('Error loading fire data:', err);
  }
}

loadFireData();
