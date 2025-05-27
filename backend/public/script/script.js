document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.name) {
    // No session — redirect to login
    window.location.href = '/login.html';
  } else {
    document.getElementById('fireCenterName').textContent = user.name;
  }
})
const regionCoordinates = {
  "NSW": { center: [-31.2532, 146.9211], zoom: 7 },
  "VIC": { center: [-37.4713, 144.7852], zoom: 7 },
  "QLD": { center: [-20.9176, 142.7028], zoom: 7 },
  "WA":  { center: [-25.0423, 117.7932], zoom: 7 },
  "SA":  { center: [-30.0002, 136.2092], zoom: 7 },
  "TAS": { center: [-41.4545, 145.9707], zoom: 7 },
  "NT":  { center: [-19.4914, 132.5509], zoom: 7 }
};
document.getElementById('region-select').addEventListener('change', function () {
  const selectedRegion = this.value;

  if (!selectedRegion) {
    map.setView([-25.2744, 133.7751], 5); // Reset to Australia
  } else if (regionCoordinates[selectedRegion]) {
    const { center, zoom } = regionCoordinates[selectedRegion];
    map.setView(center, zoom);
  }
});

// location search
document.getElementById('location-search').addEventListener('keypress', async function (e) {
  if (e.key === 'Enter') {
    const query = this.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}+Australia`);
      const results = await res.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        map.setView([lat, lon], 10); // Zoom to location
        L.popup()
          .setLatLng([lat, lon])
          .setContent(`📍 ${display_name}`)
          .openOn(map);
      } else {
        alert('No location found.');
      }
    } catch (err) {
      console.error('Location search failed:', err);
      alert('Search error. Please try again.');
    }
  }
});

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
function logout() {
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}
loadFireData();
