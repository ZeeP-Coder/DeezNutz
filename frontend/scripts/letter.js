const envelope = document.getElementById('envelope');

window.addEventListener('load', () => {
  setTimeout(() => {
    envelope.classList.add('is-open');
  }, 250);
});
