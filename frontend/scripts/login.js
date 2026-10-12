const loginError = document.getElementById('loginError');
const loginForm = document.querySelector('.login-form');
const loginPage = document.querySelector('.login-page');
const submitButton = loginForm.querySelector('button[type="submit"]');
const params = new URLSearchParams(window.location.search);

if (params.get('error') === '1') {
  loginError.hidden = false;
}

const playUnlockSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const gain = context.createGain();
  const firstNote = context.createOscillator();
  const secondNote = context.createOscillator();
  const start = context.currentTime;

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.08, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
  firstNote.frequency.value = 523.25;
  secondNote.frequency.value = 659.25;
  firstNote.connect(gain);
  secondNote.connect(gain);
  gain.connect(context.destination);
  firstNote.start(start);
  secondNote.start(start + 0.1);
  firstNote.stop(start + 0.2);
  secondNote.stop(start + 0.42);
  window.setTimeout(() => context.close(), 600);
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginPage.classList.add('is-submitting');
  submitButton.disabled = true;
  playUnlockSound();

  window.setTimeout(() => {
    HTMLFormElement.prototype.submit.call(loginForm);
  }, 650);
});
