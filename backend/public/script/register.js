 // Form submission handler
 function submitRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const centerData = {
      name: formData.get('name'),
      state: formData.get('state'),
      location: formData.get('location'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      mobile: formData.get('mobile'),
      fax: formData.get('fax'),
      password: formData.get('password'),
      status: formData.get('status'),
      description: formData.get('description')
    };

    fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(centerData)
      })
      .then(res => res.json())
      .then(data => {
        // Show success message
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
      
        // Reset or redirect
        setTimeout(() => {
          if (confirm(data.message + ' Would you like to register another center?')) {
            document.getElementById('registerForm').reset();
            document.getElementById('successMessage').style.display = 'none';
          } else {
            navigateTo('fire-centers'); // or redirect as needed
          }
        }, 1500);
      })
      .catch(err => {
        console.error('Registration failed:', err);
        alert('❌ Failed to register fire center.');
});

  // Cancel registration
  function cancelRegistration() {
    if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      navigateTo('fire-centers');
    }
  }

  // Navigation function
  function navigateTo(page) {
    switch(page) {
      case 'dashboard':
        window.location.href = './../index.html'; 
        break;
      case 'report':
        alert('Navigating to Report...');
        break;
      case 'fire-centers':
        window.location.href = './../FireCenters.html'; 
        break;
      case 'settings':
        alert('Navigating to Settings...');
        break;
    }
  }

  // Form validation and enhancement
  document.addEventListener('DOMContentLoaded', function() {
    // Add form validation feedback
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
      field.addEventListener('blur', function() {
        if (!this.value.trim()) {
          this.style.borderColor = '#dc3545';
        } else {
          this.style.borderColor = '#28a745';
        }
      });

      field.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(220, 53, 69)' && this.value.trim()) {
          this.style.borderColor = '#e9ecef';
        }
      });
    });

    // Auto-format phone numbers
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
      field.addEventListener('input', function() {
        // Basic phone number formatting (Australian format)
        let value = this.value.replace(/\D/g, '');
        if (value.startsWith('61')) {
          value = '+' + value.substring(0, 2) + ' ' + value.substring(2, 3) + ' ' + value.substring(3, 7) + ' ' + value.substring(7);
        } else if (value.startsWith('0')) {
          value = '+61 ' + value.substring(1, 2) + ' ' + value.substring(2, 6) + ' ' + value.substring(6);
        }
        this.value = value.trim();
      });
    });
  });}