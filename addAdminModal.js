function initializeAddAdminModal() {
  var modal = document.getElementById("addAdminModal");
  var btn = document.getElementById("addAdminLink");
  var span = modal.getElementsByClassName("close")[0];

  if (btn) {
    btn.onclick = function() {
      modal.style.display = "block";
    }
  }

  if (span) {
    span.onclick = function() {
      modal.style.display = "none";
    }
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  document.getElementById('addAdminForm').addEventListener('submit', function (event) {
    event.preventDefault();

    document.getElementById('addAdminLoader').style.display = 'block';
    document.getElementById('addAdminSuccessMessage').style.display = 'none';

    const adminData = {
      "name": document.getElementById('adminName').value,
      "email": document.getElementById('adminEmail').value,
      "password": document.getElementById('adminPassword').value,
      "role": document.getElementById('adminRole').value
    };

    const token = localStorage.getItem('accessToken');

    fetch('https://backend-r7hk.onrender.com/api/auth/admin-add-staff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      
      document.getElementById('addAdminLoader').style.display = 'none';
      
      const successMessage = document.getElementById('addAdminSuccessMessage');
      successMessage.innerHTML = `<h3>Admin added successfully!</h3>`;
      successMessage.style.display = 'block';
      
      document.getElementById('addAdminForm').reset();
      
      setTimeout(() => {
        successMessage.style.display = 'none';
        modal.style.display = "none";
      }, 5000);
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById('addAdminLoader').style.display = 'none';
      const errorMessage = document.getElementById('addAdminSuccessMessage');
      if (error.message === 'Access denied. Admin only.') {
        errorMessage.innerHTML = `<h3>Error: You do not have permission to add an admin. Please contact a super admin for assistance.</h3>`;
      } else {
        errorMessage.innerHTML = `<h3>Error adding admin: ${error.message || 'Please try again.'}</h3>`;
      }
      errorMessage.style.display = 'block';
      errorMessage.style.backgroundColor = '#f8d7da';
      errorMessage.style.color = '#721c24';
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAddAdminModal);
} else {
  initializeAddAdminModal();
}