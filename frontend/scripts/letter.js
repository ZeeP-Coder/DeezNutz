const envelope = document.getElementById('envelope');
const openHint = document.getElementById('openHint');
const resetButton = document.getElementById('resetButton');

const openEnvelope = () => {
  if (envelope.classList.contains('is-open')) return;

  envelope.classList.add('is-open');
  envelope.setAttribute('aria-expanded', 'true');
  openHint.setAttribute('aria-hidden', 'true');
  resetButton.hidden = false;
};

const resetEnvelope = () => {
  envelope.classList.remove('is-open');
  envelope.setAttribute('aria-expanded', 'false');
  openHint.setAttribute('aria-hidden', 'false');
  resetButton.hidden = true;
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
