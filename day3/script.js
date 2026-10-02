// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];


// 1. Search notes by word
function searchNotes(word) {
  const searchWord = word.toLowerCase();

  return notes.filter((note) =>
    note.text.toLowerCase().includes(searchWord)
  );
}


// 2. Find the longest note
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }

  return longest;
}


// 3. Count notes by category
function countByCategory() {
  const counts = {};

  for (const note of notes) {
    if (!counts[note.category]) {
      counts[note.category] = 0;
    }

    counts[note.category]++;
  }

  return counts;
}


// 4. Create a summary
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;

  const noteWord = total === 1 ? "note" : "notes";

  return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}


// 5. Check whether a note is a duplicate
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some(
    (note) => note.text.trim().toLowerCase() === cleanedText
  );
}


// 6. Add a new note
function addNote(text, category) {
  const cleanedText = text.trim();

  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log("❌ Note rejected: text must be 1-200 characters.");
    return false;
  }

  if (isDuplicate(cleanedText)) {
    console.log("❌ Note rejected: duplicate note.");
    return false;
  }

  if (!["personal", "work", "study"].includes(category)) {
    console.log("❌ Note rejected: invalid category.");
    return false;
  }

  const newNote = {
    id: notes.length + 1,
    text: cleanedText,
    category: category,
  };

  notes.push(newNote);

  console.log(`✅ Note added: "${newNote.text}"`);
  return true;
}


// -------------------------
// TESTS
// -------------------------

// searchNotes - normal case
console.log(searchNotes("JavaScript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

// searchNotes - edge case
console.log(searchNotes("pizza"));
// Expected: []


// longestNote - normal case
console.log(longestNote());
// Expected: the note object with the longest text


// longestNote - edge case
console.log("Longest note when notes are available:", longestNote());
// Expected: a note object, not null


// countByCategory - normal case
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }


// countByCategory - edge case
console.log("Category counts:", countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }


// getSummary - normal case
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."


// getSummary - edge case
console.log("Summary:", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."


// isDuplicate - normal case
console.log(isDuplicate("Buy milk and bread"));
// Expected: true


// isDuplicate - edge case
console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true


// addNote - normal case
console.log(addNote("Prepare presentation slides", "work"));
// Expected: true


// addNote - edge case: duplicate
console.log(addNote("  BUY MILK AND BREAD  ", "personal"));
// Expected: false