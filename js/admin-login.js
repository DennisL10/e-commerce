// admin-login.js

document.getElementById('login-form').addEventListener('submit', function(event) {
   event.preventDefault(); // Prevent form submission

   const password = document.getElementById('password').value;
   const correctPassword = '1'; // Replace this with your actual password

   if (password === correctPassword) {
       // Redirect to the admin page
       window.location.href = 'admin.html';
   } else {
       alert('Contraseña incorrecta');
   }
});
