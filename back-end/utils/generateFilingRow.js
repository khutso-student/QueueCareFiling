const Filing = require('../models/Filing');

const generateNextFilingRow = async () => {
  const lastFiling = await Filing.findOne().sort({ createdAt: -1 });

  if (!lastFiling) return 'A01'; // First filing

  const lastRow = lastFiling.filingRow; // e.g., "A01"
  const letter = lastRow.charAt(0);     // "A"
  const number = parseInt(lastRow.slice(1)); // 1

  if (number < 100) {
    const newNumber = String(number + 1).padStart(2, '0'); // "02", "03", ...
    return `${letter}${newNumber}`;
  } else {
    const newLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
    if (newLetter > 'Z') throw new Error('Filing rows exceeded Z100.');
    return `${newLetter}01`;
  }
};

module.exports = generateNextFilingRow;
