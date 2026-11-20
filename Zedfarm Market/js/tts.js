// Read-aloud using the Web Speech API (speechSynthesis).
// Falls back to English if no voice exists for the selected language.
import { getLang, t } from './i18n.js';
import { toast } from './utils.js';

let synth = null;
let currentUtterance = null;
let speaking = false;
let paused = false;
let rate = 1;

function voices() { return synth ? synth.getVoices() : []; }

function pickVoice(langCode) {
  const vs = voices();
  // Map internal lang -> BCP47
  const bcp = langCode === 'bem' ? 'en' : (langCode === 'ny' ? 'ny' : langCode);
  // Try exact/startsWith
  let v = vs.find(x => x.lang.toLowerCase().startsWith(bcp));
  if (!v && langCode !== 'en') {
    // fallback to English
    v = vs.find(x => x.lang.toLowerCase().startsWith('en'));
    return { voice: v, fallback: true };
  }
  return { voice: v, fallback: false };
}

function ensureSynth() {
  if (typeof window === 'undefined') return false;
  synth = window.speechSynthesis;
  return !!synth;
}

export function speak(text, langCode) {
  if (!ensureSynth()) {
    toast('Voice speech is not supported by your browser.', 'error');
    return;
  }
  stop();
  const { voice, fallback } = pickVoice(langCode || getLang());
  if (fallback && langCode && langCode !== 'en') {
    const msg = t('tts.noVoice');
    toast(msg, 'info');
  }
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  if (voice) u.voice = voice;
  u.lang = voice ? voice.lang : 'en-US';
  u.onstart = () => { speaking = true; paused = false; updateBar(); };
  u.onend = () => { speaking = false; paused = false; updateBar(); };
  u.onerror = () => { speaking = false; paused = false; updateBar(); };
  currentUtterance = u;
  synth.speak(u);
  updateBar();
}

export function pause() {
  if (!synth) return;
  if (speaking && !paused) {
    synth.pause();
    paused = true;
  } else if (paused) {
    synth.resume();
    paused = false;
  }
  updateBar();
}

export function stop() {
  if (synth) synth.cancel();
  speaking = false;
  paused = false;
  currentUtterance = null;
  updateBar();
}

export function setRate(r) {
  rate = r;
  if (speaking && currentUtterance) {
    // If speaking, restart from current text with new rate
    // or keep for next sentence
  }
  updateBar();
}

function updateBar() {
  const bar = document.getElementById('tts-bar');
  if (!bar) return;
  const playBtn = bar.querySelector('[data-tts="play"]');
  const pauseBtn = bar.querySelector('[data-tts="pause"]');
  const status = bar.querySelector('[data-tts="status"]');
  const pulse = bar.querySelector('.tts-pulse');

  if (playBtn) playBtn.disabled = speaking && !paused;
  if (pauseBtn) pauseBtn.textContent = paused ? '▶️ ' + t('tts.play') : '⏸️ ' + t('tts.pause');
  
  if (status) {
    status.textContent = speaking ? (paused ? 'Paused' : 'Reading aloud...') : 'Voice Reader';
  }
  if (pulse) {
    pulse.style.display = speaking && !paused ? 'inline-block' : 'none';
  }
}

function injectBar() {
  if (document.getElementById('tts-bar')) return;
  const bar = document.createElement('div');
  bar.id = 'tts-bar';
  bar.className = 'tts-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Screen reader audio controls');
  bar.innerHTML = `
    <span class="tts-pulse" style="display:none;" aria-hidden="true"></span>
    <span data-tts="status" style="font-size:0.85rem; font-weight:700; color:var(--color-primary); margin-right:4px;">Voice Reader</span>
    <button type="button" data-tts="play" class="btn btn--sm btn--primary">▶️ ${t('tts.play')}</button>
    <button type="button" data-tts="pause" class="btn btn--sm btn--ghost">⏸️ ${t('tts.pause')}</button>
    <button type="button" data-tts="stop" class="btn btn--sm btn--ghost">⏹️ ${t('tts.stop')}</button>
    <label for="tts-speed" class="sr-only">${t('tts.speed')}</label>
    <select id="tts-speed" data-tts="speed" style="min-height:36px; padding:4px 8px; border-radius:var(--radius-full); border:1px solid var(--color-border); background:var(--color-surface); color:var(--color-text); font-size:0.85rem; font-weight:600;">
      <option value="0.75">0.75x</option>
      <option value="1" selected>1.0x</option>
      <option value="1.25">1.25x</option>
      <option value="1.5">1.5x</option>
    </select>
  `;
  document.body.appendChild(bar);

  bar.querySelector('[data-tts="play"]').addEventListener('click', () => {
    readPage();
  });
  bar.querySelector('[data-tts="pause"]').addEventListener('click', pause);
  bar.querySelector('[data-tts="stop"]').addEventListener('click', stop);
  bar.querySelector('[data-tts="speed"]').addEventListener('change', (e) => setRate(Number(e.target.value)));
}

export function readPage() {
  const main = document.querySelector('main') || document.body;
  // Collect readable text from main landmark
  const text = main.innerText.replace(/\s+/g, ' ').trim();
  speak(text, getLang());
}

export function initTTS() {
  if (!ensureSynth()) return;
  
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => {};
  }
  
  injectBar();

  // Wire "Read this page" button in header toolbar if present
  const btn = document.getElementById('readPageBtn');
  if (btn) btn.addEventListener('click', readPage);

  // Wire all individual card/item [data-read-text] buttons across the site
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-read-text]');
    if (target) {
      const text = target.getAttribute('data-read-text');
      if (text) {
        speak(text, getLang());
      }
    }
  });

  // Update TTS bar labels when language changes
  document.addEventListener('zedfarm:langchange', () => {
    const bar = document.getElementById('tts-bar');
    if (!bar) return;
    const play = bar.querySelector('[data-tts="play"]');
    const pause = bar.querySelector('[data-tts="pause"]');
    const stop = bar.querySelector('[data-tts="stop"]');
    if (play) play.innerHTML = `▶️ ${t('tts.play')}`;
    if (pause) pause.innerHTML = `⏸️ ${t('tts.pause')}`;
    if (stop) stop.innerHTML = `⏹️ ${t('tts.stop')}`;
  });
}

// expose toast global hook setter
export function setToast(fn) { window.ZedToast = fn; }
