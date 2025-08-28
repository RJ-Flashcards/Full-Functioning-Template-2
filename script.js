/***** Flashcards: duplicate badge + simple on-screen debug *****/

let cards = [];                 // current deck (Day or A-Z)
let duplicates = new Set();     // words that repeat within this deck

// --- tiny on-page debug line (safe to remove later) ---
function setDebug(text) {
  let el = document.getElementById('dupDebug');
  if (!el) {
    el = document.createElement('div');
    el.id = 'dupDebug';
    el.style.fontSize = '12px';
    el.style.margin = '8px auto';
    el.style.maxWidth = '480px';
    el.style.opacity = '0.8';
    el.style.padding = '6px 10px';
    el.style.borderRadius = '8px';
    el.style.background = '#f3f3f3';
    el.style.border = '1px solid #ddd';
    el.style.textAlign = 'center';
    document.body.appendChild(el);
  }
  el.textContent = text;
}

// Normalize for duplicate matching (trim, collapse spaces, case-insensitive, NFC)
function norm(w) {
  return (w || '')
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

// Ensure the front has #wordText and #dupBadge (create if missing)
function ensureFrontChildren() {
  const front = document.getElementById('cardFront');
  if (!front) return {};

  let wordText = document.getElementById('wordText');
  if (!wordText) {
    wordText = document.createElement('span');
    wordText.id = 'wordText';
    front.appendChild(wordText);
  }

  let dupBadge = document.getElementById('dupBadge');
  if (!dupBadge) {
    dupBadge = document.createElement('span');
    dupBadge.id = 'dupBadge';
    dupBadge.className = 'dup-badge';
    dupBadge.setAttribute('aria-label', 'Duplicate word');
    dupBadge.setAttribute('title', 'Duplicate word');
    dupBadge.textContent = '⚠️';
    front.appendChild(dupBadge);
  }

  return { wordText, dupBadge };
}

/**
 * Call this after your CSV rows are loaded for the CURRENT deck.
 * `data` must be an array of [Word, Definition]
 */
function loadCardsFromCSV(data) {
  // 1) Build cards (skip empty rows)
  cards = (data || [])
    .filter(row => row && (row[0] || row[1]))
    .map(row => ({
      word: (row[0] || '').trim(),
      definition: (row[1] || '').trim()
    }));

  // 2) Count words in THIS deck (normalized)
  const counts = {};
  for (const c of cards) {
    const key = norm(c.word);
    if (!key) continue;
    counts[key] = (counts[key] || 0) + 1;
  }

  // 3) Identify duplicates within THIS deck
  duplicates = new Set(Object.keys(counts).filter(k => counts[k] > 1));

  // Debug: show how many duplicates the APP sees in THIS deck
  setDebug(`Duplicates in current deck: ${duplicates.size}`);

  // 4) Render first card (keep your own currentIndex if you have one)
  const idx = (typeof currentIndex === 'number' ? currentIndex : 0);
  showCard(idx);
}

/**
 * Renders a single card by index.
 * Safe even if the #wordText / #dupBadge spans weren’t in the HTML.
 */
function showCard(index) {
  const card = cards[index] || { word: '', definition: '' };
  const back = document.getElementById('cardBack');

  // Make sure front children exist
  const { wordText, dupBadge } = ensureFrontChildren();
  if (!wordText || !dupBadge || !back) {
    setDebug('Waiting for DOM elements…');
    return;
  }

  // Populate
  wordText.textContent = card.word || '';
  back.textContent     = card.definition || '';

  // Toggle the badge using normalized key
  const key = norm(card.word);
  const isDup = key && duplicates.has(key);

  dupBadge.style.display = isDup ? 'inline-block' : 'none';

  // Update debug for current card
  setDebug(`Duplicates in current deck: ${duplicates.size} — current: "${card.word}" → ${isDup ? 'DUP' : 'unique'}`);
}

/* 
USAGE REMINDER:
- Your existing code should already fetch CSV for the selected deck, then call:
    loadCardsFromCSV(rowsArray);

- This file does not change your navigation/Next/Back logic.
- The badge will appear ONLY when the same word appears more than once
  in the CURRENT deck (e.g., within the A-Z deck itself, or within Day X itself).
*/
