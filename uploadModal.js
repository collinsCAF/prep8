function initializeModal() {
  var modal = document.getElementById("uploadModal");
  var btn = document.getElementById("uploadLink");
  var span = document.getElementsByClassName("close")[0];

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

  document.getElementById('uploadQuestionForm').addEventListener('submit', function (event) {
    event.preventDefault();

    document.getElementById('loader').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';

    const questionData = {
      "questionText": document.getElementById('question').value,
      "options": [
        { "option": document.getElementById('optionA').value, "optionLabel": "Option A" },
        { "option": document.getElementById('optionB').value, "optionLabel": "Option B" },
        { "option": document.getElementById('optionC').value, "optionLabel": "Option C" },
        { "option": document.getElementById('optionD').value, "optionLabel": "Option D" }
      ],
      "correctAnswer": `Option ${document.getElementById('correctAnswer').value}`,
      "answerDescription": document.getElementById('description').value,
      "category": document.getElementById('category').value
    };

    const token = localStorage.getItem('accessToken');

    fetch('https://backend-r7hk.onrender.com/api/questions/upload-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      
      document.getElementById('loader').style.display = 'none';
      
      const successMessage = document.getElementById('successMessage');
      successMessage.innerHTML = `
        <h3>${data.message}</h3>
        <p>Question ID: ${data.question._id}</p>
        <p>Category: ${data.question.category}</p>
        <p>Uploaded At: ${new Date(data.question.uploadedAt).toLocaleString()}</p>
      `;
      successMessage.style.display = 'block';
      
      document.getElementById('uploadQuestionForm').reset();
      
      setTimeout(() => {
        successMessage.style.display = 'none';
        modal.style.display = "none";
      }, 5000);
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById('loader').style.display = 'none';
      const successMessage = document.getElementById('successMessage');
      successMessage.innerHTML = `<h3>Error uploading question. Please try again.</h3>`;
      successMessage.style.display = 'block';
    });
  });
}

// This ensures the modal is initialized even if it's loaded after the DOMContentLoaded event
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeModal);
} else {
  initializeModal();
}