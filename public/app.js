const form = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const message = document.querySelector('#form-message');
const submitButton = form.querySelector('.submit-button');
const buttonLabel = form.querySelector('.button-label');
const togglePassword = document.querySelector('.toggle-password');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  message.className = 'form-message';

  if (!emailInput.value.trim() || !passwordInput.value) {
    message.textContent = 'Enter your email and password.';
    return;
  }

  submitButton.disabled = true;
  buttonLabel.textContent = 'Signing in...';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Unable to sign in.');

    message.className = 'form-message success';
    message.textContent = `Welcome back, ${data.user.name}.`;
  } catch (error) {
    message.textContent = error.message;
  } finally {
    submitButton.disabled = false;
    buttonLabel.textContent = 'Sign in';
  }
});

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.textContent = isPassword ? 'Hide' : 'Show';
  togglePassword.setAttribute('aria-label', `${isPassword ? 'Hide' : 'Show'} password`);
  togglePassword.setAttribute('aria-pressed', String(isPassword));
});

document.querySelector('#forgot-link').addEventListener('click', (event) => {
  event.preventDefault();
  message.className = 'form-message';
  message.textContent = 'Password recovery can be connected to your email provider next.';
});

document.querySelector('#signup-link').addEventListener('click', (event) => {
  event.preventDefault();
  message.className = 'form-message';
  message.textContent = 'Account creation can be added next.';
});
