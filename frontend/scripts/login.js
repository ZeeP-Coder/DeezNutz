const loginError = document.getElementById('loginError');
const loginForm = document.querySelector('.login-form');
const loginPage = document.querySelector('.login-page');
const submitButton = loginForm.querySelector('button[type="submit"]');
const params = new URLSearchParams(window.location.search);

if (params.get('error') === '1') {
  loginError.hidden = false;
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginPage.classList.add('is-submitting');
  submitButton.disabled = true;
  window.sessionStorage.setItem('birthdaySound', 'on');

  window.setTimeout(() => {
    HTMLFormElement.prototype.submit.call(loginForm);
  }, 650);
});
