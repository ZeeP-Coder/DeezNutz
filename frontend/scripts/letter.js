const envelope = document.getElementById('envelope');
const openHint = document.getElementById('openHint');
const resetButton = document.getElementById('resetButton');
let replayTimer;

const openEnvelope = () => {
  if (envelope.classList.contains('is-open')) return;

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
