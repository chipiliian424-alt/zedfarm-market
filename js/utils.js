// Shared UI helpers used across pages.
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) { return iso; }
}

export function formatPrice(n) {
  const num = Number(n);
  if (isNaN(num)) return n;
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

let toastTimer = null;
export function toast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' toast--error' : type === 'success' ? ' toast--success' : '');
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

export function setLoading(el, loading, text) {
  if (!el) return;
  if (loading) {
    el.dataset.prevHtml = el.innerHTML;
    el.innerHTML = `<div class="loading"><div class="spinner" role="status" aria-label="Loading"></div><p>${escapeHtml(text || 'Loading...')}</p></div>`;
  } else if (el.dataset.prevHtml != null) {
    el.innerHTML = el.dataset.prevHtml;
    delete el.dataset.prevHtml;
  }
}

export function showEmpty(el, message) {
  if (!el) return;
  el.innerHTML = `<div class="empty-state"><div class="icon" aria-hidden="true">🌾</div><p>${escapeHtml(message)}</p></div>`;
}

export function announce(msg) {
  let region = document.getElementById('live-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'live-region';
    region.className = 'live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
  }
  region.textContent = '';
  setTimeout(() => { region.textContent = msg; }, 50);
}

export function getQueryParam(name) {
  return new URLSearchParams(location.search).get(name);
}
