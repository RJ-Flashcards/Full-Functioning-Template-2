let cards = [];                 // current deck (Day or A-Z)
let duplicates = new Set();     // words that repeat within this deck

function loadCardsFromCSV(data) {
  // data: array of rows [Word, Definition]
  cards = data
    .filter(row => row && (row[0] || row[1]))     // skip empty rows
    .map(row => ({ word: (row[0] || '').trim(), definition: (row[1] || '').trim() }));

  // Count words in THIS deck
  const counts = {};
  cards.forEach(c => {
    if (!c.word) return;
    counts[c.word] = (counts[c.word] || 0) + 1;
  });

  // Identify duplicates
  duplicates = new Set(Object.keys(counts).filter(w => counts[w] > 1));

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
    // Fallback in case #wordText wasn't added yet
    const front = document.getElementById('cardFront');
    if (front) front.textContent = card?.word || '';
  }
  back.textContent = card?.definition || '';

  // Toggle the badge (visible only when the word is a duplicate within this deck)
  if (dupBadge) {
    if (card?.word && duplicates.has(card.word)) {
      dupBadge.style.display = 'inline-block';
    } else {
      dupBadge.style.display = 'none';
    }
  }
}
