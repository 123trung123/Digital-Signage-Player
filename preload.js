window.addEventListener('DOMContentLoaded', () => {
  const { ipcRenderer } = require('electron');
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      ipcRenderer.send('login', { email, password });

      ipcRenderer.on('login-success', (event, user) => {
        console.log('Login successful:', user);
      });

      ipcRenderer.on('login-failed', (event, error) => {
        console.error('Login failed:', error);
      });
    });
  }
});
