const clickMeButton = document.querySelector('.click-me');
const envelopeCard = document.getElementById('envelopeCard');

const beginReveal = () => {
  if (!envelopeCard) return;

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
