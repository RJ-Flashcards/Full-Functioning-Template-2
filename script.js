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

  // …continue your existing init: currentIndex = 0; render; etc.
  showCard(currentIndex);
}

/* ⬇️ REPLACE your existing showCard with this version */
function showCard(index) {
  const card     = cards[index];
  const wordText = document.getElementById('wordText'); // span inside #cardFront
  const back     = document.getElementById('cardBack');
  const dupBadge = document.getElementById('dupBadge');

  // Populate front/back
  if (wordText) {
    wordText.textContent = card?.word || '';
  } else {
    // Fallback if #wordText isn't present
    const front = document.getElementById('cardFront');
    if (front) front.textContent = card?.word || '';
  }
  back.textContent = card?.definition || '';

  // Toggle the badge using normalized key
  if (dupBadge) {
    const key = norm(card?.word);
    dupBadge.style.display = key && duplicates.has(key) ? 'inline-block' : 'none';
  }
}
