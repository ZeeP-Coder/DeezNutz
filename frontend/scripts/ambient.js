const ambientButton = document.getElementById('ambientButton');
const AudioContext = window.AudioContext || window.webkitAudioContext;
let ambientContext;
let ambientGain;
let melodyTimer;
let melodyStep = 0;

const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];

const updateAmbientButton = (isPlaying) => {
  if (!ambientButton) return;

  ambientButton.textContent = isPlaying ? 'Sound: On' : 'Sound: Off';
  ambientButton.setAttribute('aria-pressed', String(isPlaying));
  ambientButton.setAttribute(
    'aria-label',
    isPlaying ? 'Turn ambient sound off' : 'Turn ambient sound on'
  );
};

const createAmbientSound = () => {
  if (!AudioContext) return false;

  ambientContext = new AudioContext();
  ambientGain = ambientContext.createGain();
  ambientGain.gain.value = 0.0001;
  ambientGain.connect(ambientContext.destination);
  return true;
};

const playBirthdayNote = (frequency, duration = 0.34) => {
  if (!ambientContext || !ambientGain) return;

  const start = ambientContext.currentTime;
  const oscillator = ambientContext.createOscillator();
  const noteGain = ambientContext.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, start);
  noteGain.gain.setValueAtTime(0.0001, start);
  noteGain.gain.exponentialRampToValueAtTime(0.14, start + 0.025);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(noteGain);
  noteGain.connect(ambientGain);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
};

const playMelodyStep = () => {
  playBirthdayNote(melody[melodyStep % melody.length]);
  if (melodyStep % 4 === 0) {
    playBirthdayNote(melody[melodyStep % melody.length] / 2, 0.7);
  }
  melodyStep += 1;
};

const startAmbientSound = async () => {
  if (!AudioContext) return;

  if (!ambientContext && !createAmbientSound()) return;
  await ambientContext.resume();
  if (ambientContext.state !== 'running') return;

  if (melodyTimer) {
    window.clearInterval(melodyTimer);
  }
  ambientGain.gain.cancelScheduledValues(ambientContext.currentTime);
  ambientGain.gain.setTargetAtTime(0.075, ambientContext.currentTime, 0.08);
  playMelodyStep();
  melodyTimer = window.setInterval(playMelodyStep, 430);
  window.sessionStorage.setItem('birthdaySound', 'on');
  updateAmbientButton(true);
};

const stopAmbientSound = async () => {
  if (!ambientContext || !ambientGain) return;

  window.clearInterval(melodyTimer);
  melodyTimer = undefined;
  ambientGain.gain.cancelScheduledValues(ambientContext.currentTime);
  ambientGain.gain.setTargetAtTime(0.0001, ambientContext.currentTime, 0.12);
  await ambientContext.suspend();
  window.sessionStorage.setItem('birthdaySound', 'off');
  updateAmbientButton(false);
};

const toggleAmbientSound = () => {
  if (ambientContext && ambientContext.state === 'running') {
    stopAmbientSound();
    return;
  }

  startAmbientSound();
};

if (ambientButton) {
  updateAmbientButton(false);
  ambientButton.addEventListener('click', toggleAmbientSound);
}

window.startAmbientSound = startAmbientSound;

if (window.sessionStorage.getItem('birthdaySound') === 'on') {
  startAmbientSound();
}
