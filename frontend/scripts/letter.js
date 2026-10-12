const envelope = document.getElementById('envelope');
const openHint = document.getElementById('openHint');
const resetButton = document.getElementById('resetButton');
let replayTimer;

const playOpenSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const gain = context.createGain();
  const firstNote = context.createOscillator();
  const secondNote = context.createOscillator();
  const start = context.currentTime;

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.05, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
  firstNote.frequency.value = 392;
  secondNote.frequency.value = 587.33;
  firstNote.connect(gain);
  secondNote.connect(gain);
  gain.connect(context.destination);
  firstNote.start(start);
  secondNote.start(start + 0.12);
  firstNote.stop(start + 0.24);
  secondNote.stop(start + 0.5);
  window.setTimeout(() => context.close(), 700);
};

const openEnvelope = () => {
  if (envelope.classList.contains('is-open')) return;

  if (window.startAmbientSound) {
    window.startAmbientSound();
  }
  playOpenSound();
  envelope.classList.add('is-open');
  envelope.setAttribute('aria-expanded', 'true');
  openHint.setAttribute('aria-hidden', 'true');
  resetButton.hidden = false;
  resetButton.disabled = true;
  replayTimer = window.setTimeout(() => {
    if (envelope.classList.contains('is-open')) {
      resetButton.disabled = false;
    }
  }, 3300);
};

const resetEnvelope = () => {
  window.clearTimeout(replayTimer);
  envelope.classList.remove('is-open');
  envelope.setAttribute('aria-expanded', 'false');
  openHint.setAttribute('aria-hidden', 'false');
  resetButton.hidden = true;
  resetButton.disabled = false;
  envelope.focus();
};

envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openEnvelope();
  }
});
resetButton.addEventListener('click', resetEnvelope);
