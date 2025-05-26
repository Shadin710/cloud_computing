  // Demo fire center accounts
    const fireCenterAccounts = {
      'sydney.fire@fireapp.gov.au': {
        password: 'fireapp2024',
        centerName: 'Sydney Fire Control Center',
        state: 'New South Wales'
      },
      'melbourne.fire@fireapp.gov.au': {
        password: 'fireapp2024',
        centerName: 'Melbourne Emergency Center',
        state: 'Victoria'
      },
      'brisbane.fire@fireapp.gov.au': {
        password: 'fireapp2024',
        centerName: 'Brisbane Fire Command',
        state: 'Queensland'
      },
      'perth.fire@fireapp.gov.au': {
        password: 'fireapp2024',
        centerName: 'Perth Fire Station',
        state: 'Western Australia'
      }
    };

    // Fill demo credentials
    function fillDemo(center) {
      const emailField = document.getElementById('email');
      const passwordField = document.getElementById('password');
      
      if (center === 'sydney') {
        emailField.value = 'sydney.fire@fireapp.gov.au';
      } else if (center === 'melbourne') {
        emailField.value = 'melbourne.fire@fireapp.gov.au';
      }
      
      passwordField.value = 'fireapp2024';
      emailField.focus();
    }

    // Toggle password visibility
    function togglePassword() {
      const passwordField = document.getElementById('password');
      const toggleBtn = document.getElementById('passwordToggle');
      
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleBtn.textContent = '🙈';
      } else {
        passwordField.type = 'password';
        toggleBtn.textContent = '👁️';
      }
    }

    // Handle login form submission
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  hideMessage('error');
  hideMessage('success');
  showLoading(true);

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('success', result.message);

      // Optionally store user info (use cookies/session/JWT in real apps)
      localStorage.setItem('user', JSON.stringify(result.user));

      setTimeout(() => {
        window.location.href = '../user_dashboard.html'; // Redirect to fire center dashboard
      }, 2000);
    } else {
      showMessage('error', result.message);
    }
  } catch (err) {
    console.error('Login failed:', err);
    showMessage('error', 'Unable to login. Please try again later.');
  }

  showLoading(false);
}

    // Show loading state
    function showLoading(show) {
      const loginBtn = document.getElementById('loginBtn');
      const loginText = document.getElementById('loginText');
      const loadingSpinner = document.getElementById('loadingSpinner');
      
      if (show) {
        loginBtn.disabled = true;
        loginText.style.display = 'none';
        loadingSpinner.style.display = 'flex';
      } else {
        loginBtn.disabled = false;
        loginText.style.display = 'block';
        loadingSpinner.style.display = 'none';
      }
    }

    // Show message
    function showMessage(type, message) {
      const elementId = type === 'error' ? 'errorMessage' : 'successMessage';
      const element = document.getElementById(elementId);
      element.textContent = message;
      element.style.display = 'block';
      
      // Auto-hide after 5 seconds for error messages
      if (type === 'error') {
        setTimeout(() => hideMessage(type), 5000);
      }
    }

    // Hide message
    function hideMessage(type) {
      const elementId = type === 'error' ? 'errorMessage' : 'successMessage';
      const element = document.getElementById(elementId);
      element.style.display = 'none';
    }

    // Forgot password
    function forgotPassword() {
      const email = document.getElementById('email').value.trim();
      if (email) {
        alert(`Password reset instructions will be sent to ${email}`);
      } else {
        alert('Please enter your email address first, then click "Forgot password?"');
        document.getElementById('email').focus();
      }
    }

    // Admin login
    function adminLogin() {
      if (confirm('Redirect to Admin Login page?')) {
        alert('Redirecting to Admin Login...');
        // In a real app: window.location.href = '/admin-login';
      }
    }

    // Form enhancements
    document.addEventListener('DOMContentLoaded', function() {
      // Auto-focus email field
      document.getElementById('email').focus();
      
      // Enter key handling
      document.getElementById('email').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          document.getElementById('password').focus();
        }
      });
      
      // Real-time validation feedback
      const emailField = document.getElementById('email');
      const passwordField = document.getElementById('password');
      
      emailField.addEventListener('blur', function() {
        if (this.value && !this.validity.valid) {
          this.style.borderColor = '#dc3545';
        } else if (this.value) {
          this.style.borderColor = '#28a745';
        }
      });
      
      emailField.addEventListener('input', function() {
        if (this.style.borderColor) {
          this.style.borderColor = '#e9ecef';
        }
      });
    });

    // Prevent multiple form submissions
    let isSubmitting = false;
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      if (isSubmitting) {
        e.preventDefault();
        return false;
      }
      isSubmitting = true;
      setTimeout(() => { isSubmitting = false; }, 2000);
    });