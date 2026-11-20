// Accessibility toolbar: text size, high contrast, dyslexia font.
// Preferences persisted in localStorage.
import { announce } from './utils.js';

const KEYS = { size: 'zedfarm_textsize', contrast: 'zedfarm_contrast', dyslexia: 'zedfarm_dyslexia' };
const SIZES = [90, 100, 112.5, 125, 150];

function getSizeIndex() {
  const v = Number(localStorage.getItem(KEYS.size) || 100);
  const i = SIZES.indexOf(v);
  return i === -1 ? 1 : i;
}

export function applyA11y() {
  const idx = getSizeIndex();
  document.documentElement.style.fontSize = SIZES[idx] + '%';
  document.body.classList.toggle('high-contrast', localStorage.getItem(KEYS.contrast) === '1');
  document.body.classList.toggle('dyslexia-font', localStorage.getItem(KEYS.dyslexia) === '1');
}

export function increaseText() {
  const idx = getSizeIndex();
  if (idx < SIZES.length - 1) {
    localStorage.setItem(KEYS.size, SIZES[idx + 1]);
    applyA11y();
    announce(`Text size increased to ${SIZES[idx + 1]} percent`);
  }
}

export function decreaseText() {
  const idx = getSizeIndex();
  if (idx > 0) {
    localStorage.setItem(KEYS.size, SIZES[idx - 1]);
    applyA11y();
    announce(`Text size decreased to ${SIZES[idx - 1]} percent`);
  }
}

export function toggleContrast() {
  const active = localStorage.getItem(KEYS.contrast) === '1';
  localStorage.setItem(KEYS.contrast, active ? '0' : '1');
  applyA11y();
  announce(active ? 'High contrast mode turned off' : 'High contrast mode turned on');
}

export function toggleDyslexia() {
  const active = localStorage.getItem(KEYS.dyslexia) === '1';
  localStorage.setItem(KEYS.dyslexia, active ? '0' : '1');
  applyA11y();
  announce(active ? 'Dyslexia friendly font turned off' : 'Dyslexia friendly font turned on');
}

export function initA11y() {
  applyA11y();
  const map = {
    'a11y-increase': increaseText,
    'a11y-decrease': decreaseText,
    'a11y-contrast': toggleContrast,
    'a11y-dyslexia': toggleDyslexia,
  };
  Object.entries(map).forEach(([id, fn]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  });
}
