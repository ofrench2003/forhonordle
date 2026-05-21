// ── Pick daily hero (same for everyone each day) ──────────────────
function getDailyHero() {
    const start = new Date("2025-01-01");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return heroes[diff % heroes.length];
}

const target = getDailyHero();
const guessedNames = new Set();
let gameOver = false;

// ── Elements ──────────────────────────────────────────────────────
const input      = document.getElementById("search-input");
const dropdown   = document.getElementById("dropdown");
const guessesEl  = document.getElementById("guesses");
const tableContainer = document.getElementById("table-container");
const message    = document.getElementById("message");
const giveUpBtn  = document.getElementById("give-up-btn");

// ── Search input → dropdown ───────────────────────────────────────
input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();

    if (!query) {
        dropdown.classList.add("hidden");
        return;
    }

    // Filter out already guessed heroes
    const matches = heroes.filter(h =>
        h.name.toLowerCase().includes(query) &&
        !guessedNames.has(h.name)
    );

    if (matches.length === 0) {
        dropdown.classList.add("hidden");
        return;
    }

    // Build dropdown items
    dropdown.innerHTML = "";
    matches.forEach(hero => {
        const item = document.createElement("div");
        item.classList.add("dropdown-item");
        item.textContent = hero.name;
        item.addEventListener("click", () => selectHero(hero));
        dropdown.appendChild(item);
    });

    dropdown.classList.remove("hidden");
});

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) {
        dropdown.classList.add("hidden");
    }
});

// ── Select a hero from dropdown ───────────────────────────────────
function selectHero(hero) {
    if (gameOver) return;

    input.value = "";
    dropdown.classList.add("hidden");
    guessedNames.add(hero.name);

    addGuessRow(hero);

    if (hero.name === target.name) {
        endGame(true);
    }
}

// ── Add a guess row to the grid ───────────────────────────────────
function addGuessRow(guess) {
    tableContainer.classList.remove("hidden");

    const fields = ["name", "faction", "gender", "type", "release"];
    const row = document.createElement("div");
    row.classList.add("guess-row");

    fields.forEach((field, i) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = guess[field];

        const isCorrect = guess[field] === target[field];
        cell.classList.add(isCorrect ? "correct" : "wrong");

        // Stagger the flip animation
        cell.style.animationDelay = `${i * 100}ms`;

        row.appendChild(cell);
    });

    guessesEl.prepend(row); // newest guess at the top
}

// ── Give up ───────────────────────────────────────────────────────
giveUpBtn.addEventListener("click", () => {
    if (gameOver) return;
    endGame(false);
});

// ── End game ──────────────────────────────────────────────────────
function endGame(won) {
    gameOver = true;
    input.disabled = true;
    giveUpBtn.disabled = true;
    message.classList.remove("hidden");

    if (won) {
        const count = guessedNames.size;
        message.textContent = `⚔️ Correct! You got it in ${count} ${count === 1 ? "guess" : "guesses"}!`;
        message.classList.add("win");
    } else {
        message.textContent = `The hero was ${target.name}. Better luck tomorrow!`;
        message.classList.add("lose");
    }
}