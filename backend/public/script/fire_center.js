// Sample fire centers data
let fireCenters = [
  {
    id: 1,
    name: "Sydney Fire Control Center",
    state: "New South Wales",
    status: "active",
    email: "shadin710@gmail.com",
    lastUpdated: "2024-05-26 14:30"
  },
  {
    id: 2,
    name: "Melbourne Emergency Center",
    state: "Victoria",
    status: "active",
    email: "firecenter@help.com.au",
    lastUpdated: "2024-05-26 13:45"
  },
  {
    id: 3,
    name: "Brisbane Fire Command",
    state: "Queensland",
    status: "active",
    email: "firecenter@help.com.au",
    lastUpdated: "2024-05-26 15:20"
  },
  {
    id: 4,
    name: "Perth Fire Station",
    state: "Western Australia",
    status: "active",
    email: "firecenter@help.com.au",
    lastUpdated: "2024-05-26 12:15"
  },
  {
    id: 5,
    name: "Adelaide Fire Control",
    state: "South Australia",
    status: "active",
    email: "firecenter@help.com.au",
    lastUpdated: "2024-05-26 11:30"
  },
  {
    id: 6,
    name: "Darwin Emergency Hub",
    state: "Northern Territory",
    status: "inactive",
    email: "firecenter@help.com.au",
    lastUpdated: "2024-05-25 16:45"
  },
  {
    id: 7,
    name: "Hobart Fire Center",
    state: "Tasmania",
    status: "active",
    email: "firecenter@help.com.au",
    lastUpdated: "2024-05-26 10:20"
  },
  {
    id: 8,
    name: "Canberra Fire Control",
    state: "Australian Capital Territory",
    status: "active",
    email: "firecenter@help.com.au",
    lastUpdated: "2024-05-26 14:00"
  }
];

let centerToDelete = null;

// Populate the fire centers table
async function populateFireCentersTable() {
  const tbody = document.getElementById('fireCentersTableBody');
  tbody.innerHTML = '';

  try {
    const res = await fetch('/api/fire-centers');
    const fireCenters = await res.json();

    fireCenters.forEach(center => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><div class="center-name">${center.name}</div></td>
        <td><div class="center-state">${center.state || 'N/A'}</div></td>
        <td><span class="status-badge status-${center.status || 'inactive'}">${center.status || 'inactive'}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-notify" onclick="sendNotification(${center.id})" title="Send Notification">📢</button>
            <button class="btn btn-edit" onclick="editFireCenter(${center.id})" title="Edit Center">✏️</button>
            <button class="btn btn-view" onclick="viewFireCenter(${center.id})" title="View Details">👁️</button>
            <button class="btn btn-delete" onclick="deleteFireCenter(${center.id})" title="Delete Center">🗑️</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });

    updateStats();
  } catch (err) {
    console.error('Failed to load fire centers:', err);
    tbody.innerHTML = '<tr><td colspan="5">Error loading data</td></tr>';
  }
}


// Update statistics
function updateStats() {
  const total = fireCenters.length;
  const active = fireCenters.filter(center => center.status === 'active').length;
  const inactive = fireCenters.filter(center => center.status === 'inactive').length;

  document.getElementById('totalCenters').textContent = total;
  document.getElementById('activeCenters').textContent = active;
  document.getElementById('inactiveCenters').textContent = inactive;
}

// Send notification to specific fire center
async function sendNotification(centerId) {
  try {
    const response = await fetch(`/api/notify-center/${centerId}`, {
      method: 'POST'
    });

    const result = await response.json();

    if (response.ok) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ ${result.message}`);
    }
  } catch (err) {
    console.error('Notification error:', err);
    alert('❌ Error sending notification.');
  }
}



// Edit fire center
function editFireCenter(centerId) {
  const center = fireCenters.find(c => c.id === centerId);
  if (center) {
    alert(`Opening edit form for ${center.name}...`);
    // Here you would typically open an edit modal or navigate to an edit page
  }
}

// View fire center details
function viewFireCenter(centerId) {
  const center = fireCenters.find(c => c.id === centerId);
  if (center) {
    alert(`Viewing details for ${center.name}...`);
    // Here you would typically open a details modal or navigate to a details page
  }
}

// Delete fire center
function deleteFireCenter(centerId) {
  centerToDelete = centerId;
  document.getElementById('deleteModal').style.display = 'block';
}

// Close delete modal
function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  centerToDelete = null;
}

// Confirm delete
function confirmDelete() {
  if (centerToDelete) {
    const center = fireCenters.find(c => c.id === centerToDelete);
    if (center) {
      fireCenters = fireCenters.filter(c => c.id !== centerToDelete);
      populateFireCentersTable();
      alert(`${center.name} has been deleted successfully.`);
    }
  }
  closeDeleteModal();
}

// Add new fire center
function addFireCenter() {
  window.location.href = './../register.html';
  // Here you would typically open an add modal or navigate to an add page
}

// Send global notification
function sendGlobalNotification() {
  const activeCount = fireCenters.filter(center => center.status === 'active').length;
  if (confirm(`Send notification to all ${activeCount} active fire centers?`)) {
    alert(`Global notification sent to ${activeCount} fire centers!`);
  }
}

// Navigation functions
function showDashboard() {
  window.location.href = './../index.html';
}

function showReport() {
  alert('Navigating to Report...');
}

function showFireCenters() {
  window.location.href = './../FireCenters.html';
}

function showSettings() {
  alert('Navigating to Settings...');
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById('deleteModal');
  if (event.target === modal) {
    closeDeleteModal();
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
  populateFireCentersTable();
});