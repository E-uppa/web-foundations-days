const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");
const body = document.body;


// Update character and word counts
function updateCounts() {
    const text = noteText.value;
    const characters = text.length;

    const trimmedText = text.trim();
    const words = trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.classList.remove("warning", "over");

    if (characters > 200) {
        charCount.classList.add("over");
    } else if (characters > 180) {
        charCount.classList.add("warning");
    }
}


// Save the current draft
function saveDraft() {
    localStorage.setItem("noteDraft", noteText.value);
}


// Clear the note
function clearNote() {
    noteText.value = "";

    updateCounts();

    localStorage.removeItem("noteDraft");
}


// Update the theme button label
function updateThemeButton() {
    if (body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }
}


// Restore saved draft and theme when the page loads
const savedDraft = localStorage.getItem("noteDraft");

if (savedDraft !== null) {
    noteText.value = savedDraft;
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    body.classList.add("dark");
}

updateCounts();
updateThemeButton();


// Update counts and save draft whenever the user types
noteText.addEventListener("input", function () {
    updateCounts();
    saveDraft();
});


// Clear button
clearBtn.addEventListener("click", function () {
    clearNote();
});


// Escape key clears the note
noteText.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        clearNote();
    }
});


// Theme toggle
themeToggle.addEventListener("click", function () {
    body.classList.toggle("dark");

    const isDark = body.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeButton();
});