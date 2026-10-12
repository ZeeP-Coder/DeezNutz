const clickMeButton = document.querySelector('.click-me');
const envelopeCard = document.getElementById('envelopeCard');

const playTransitionSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(220, start);
  oscillator.frequency.exponentialRampToValueAtTime(520, start + 0.45);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.06, start + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.48);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.5);
  window.setTimeout(() => context.close(), 650);
};

const beginReveal = () => {
  if (!envelopeCard) return;

  playTransitionSound();
  envelopeCard.classList.add('is-transitioning');
  document.body.classList.add('is-leaving');
  clickMeButton.setAttribute('disabled', 'true');

  window.setTimeout(() => {
    window.location.href = '/letter';
  }, 700);
};

if (clickMeButton) {
  clickMeButton.addEventListener('click', beginReveal);
}
