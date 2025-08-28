let cards = [];                 // current deck (Day or A-Z)
let duplicates = new Set();     // words that repeat within this deck

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

function loadCardsFromCSV(data) {
  // data: array of rows [Word, Definition]
  cards = data
    .filter(row => row && (row[0] || row[1]))     // skip empty rows
    .map(row => ({ word: (row[0] || '').trim(), definition: (row[1] || '').trim() }));

  // Count words in THIS deck (normalized)
  const counts = {};
  cards.forEach(c => {
    const key = norm(c.word);
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });

  // Identify duplicates
  duplicates = new Set(Object.keys(counts).filter(k => counts[k] > 1));

  // Render first card
  showCard(typeof currentIndex === 'number' ? currentIndex : 0);
}

function showCard(index) {
  const card = cards[index];
  const back = document.getElementById('cardBack');

  // Make sure front children exist (creates them if needed)
  const { wordText, dupBadge } = ensureFrontChildren();
  if (!wordText || !dupBadge || !back) return; // DOM not ready; nothing to do

  // Populate
  wordText.textContent = card?.word || '';
  back.textContent     = card?.definition || '';

  // Toggle badge
  const key = norm(card?.word);
  dupBadge.style.display = key && duplicates.has(key) ? 'inline-block' : 'none';
}
