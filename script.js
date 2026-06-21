const wordBank = [
    "the", "quick", "brown", "fox", "jumps", "over","lazy", "dog", "javascript", "programming",
     "code", "developer","computer", "keyboard", "speed", "accuracy", "infinite","challange", "screen", "system",
     "application", "window", "universe", "galaxy", "science", "future", "history","learning", "practice", "perfect",
     "climb", "mountain", "river", "ocean", "forest", "journey", "adventure", "discovery", "knowledge", "power",
     "creative", "design", "imagine", "execute", "focus", "balance", "rythm", "steady","stream", "neverending"
]

let testDuration = 60;
let timeLeft = testDuration;
let timerInterval = null;
let isTestRunning = false;

let generatedWords = [];
let currentWordIndex = 0;

let correctKeystrokes = 0;
let totalKeystrokes = 0;

const durationSelect = document.getElementById('duration-select');
const reserBtn = document.getElementById('reset-btn');
const timerVal = document.getElementById('timer-val');
const wpmVal = document.getElementById('wpm-val');
const accuracyVal = document.getElementById('accuracy-val');
const charsVal = document.getElementById('chars-val');
const textContainer = document.getElementById('text-container');
const displayBox = document.getElementById('display-box');
const inputField = document.getElementById('input-field');
const resultsModal = document.getElementById('results-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

function init() {
    testDuration = parseInt(durationSelect.value);
    timeLeft = testDuration;
    timerVal.textContent = timeLeft;

    isTestRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;

    currentWordIndex = 0;
    correctKeystrokes = 0;
    totalKeystrokes = 0;

    wpmVal.textContent = '0';
    accuracyVal.textContent = '100%';
    charsVal.textContent = '0';

    inputField.value = '';
    inputField.disabled = false;
    durationSelect.disabled = false;

    textContainer.style.top = '0px';

    generatedWords = [];
    for (let i = 0; i < 60; i++) {
        generatedWords.push(getRandomWord());
    }
    renderWords();
    highlightCurrentWord();
    inputField.focus();
}

function getRandomWord() {
    return wordBank[Math.floor(Math.random() * wordBank.length)];
}

function renderWords() {
    textContainer.innerHTML = generatedWords.map((word, index) => {
        return `<span class="word" id="word-${index}">${word}</span>`
    }).join('');
}

function highlightCurrentWord() {
    document.querySelectorAll('.word').forEach(el => el.classList.remove('current'));
    const currentWordEl = document.getElementById(`word-${currentWordIndex}`);
    if (currentWordEl) {
        currentWordEl.classList.add('current');
        scrollIfNeeded(currentWordEl);
    }
}

function scrollIfNeeded(element) {
    const boxRect = displayBox.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();

    if (elRect.bottom > boxRect.top + 90) {
        const currentTop = parseInt(textContainer.style.top || 0);
        textContainer.style.top = (currentTop - 45) + 'px';
    }
}

function startTimer() {
    isTestRunning = true;
    durationSelect.disabled = true;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerVal.textContent = timeLeft;

        calculateLiveStats();

        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function calculateLiveStats() {
    const timeElapsed = testDuration - timeLeft;
    if (timeElapsed <= 0) return;

    const activeWpm = Math.round((correctKeystrokes / 5) / (timeElapsed / 60));
    wpmVal.textContent = activeWpm >= 0 ? activeWpm : 0;

    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
    accuracyVal.textContent = accuracy + '%';
    charsVal.textContent = totalKeystrokes;
}

function endTest() {
    clearInterval(timerInterval);
    isTestRunning = false;
    inputField.disabled = true;

    const finalTimeElapsed = testDuration;
    const finalWpm = Math.round((correctKeystrokes / 5) / (finalTimeElapsed / 60));
    const finalAcc = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

    document.getElementById('final-wpm').textContent = finalWpm;
    document.getElementById('final-accuracy').textContent = finalAcc + '%';
    document.getElementById('final-chars').textContent = totalKeystrokes;

    resultsModal.style.display = 'flex';
}

inputField.addEventListener('input', () => {
    if (!isTestRunning && inputField.value.trim() !== '') {
        startTimer();
    }

    const typedValue = inputField.value;
    const currentWord = generatedWords[currentWordIndex];
    const currentWordEl = document.getElementById(`word-${currentWordIndex}`);
    if (currentWord.startsWith(typedValue.trim())) {
        currentWordEl.style.color = 'var(--text-main)';
        currentWordEl.style.backgroundColor = 'transparent';
    } else {
        currentWordEl.style.color = 'var(--card-bg)';
        currentWordEl.style.backgroundColor = 'var(--incorrect-red)';
    }
});

inputField.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();

        const typedWord = inputField.value.trim();
        if (typedWord === '') return;

        const targetWord = generatedWords[currentWordIndex];
        const currentWordEl = document.getElementById(`word-${currentWordIndex}`);

        totalKeystrokes += typedWord.length + 1;

        if (typedWord === targetWord) {
            currentWordEl.className = 'word correct';
            correctKeystrokes += targetWord.length + 1;
        } else {
            currentWordEl.className  = 'word incorrect';
        }

        currentWordIndex++;

        if (currentWordIndex >= generatedWords.length - 15) {
            for (let i = 0; i < 30; i++) {
                generatedWords.push(getRandomWord());
                const span = document.createElement('span');
                span.className = 'word';
                span.id = `word-${generatedWords.length - 1}`;
                span.textContent = generatedWords[generatedWords.length - 1];
                textContainer.appendChild(span);
            }
        }

        highlightCurrentWord();
        inputField.value = '';
        calculateLiveStats();
    }
});

durationSelect.addEventListener('change', init);
reserBtn.addEventListener('click', init);
closeModalBtn.addEventListener('click', () => {
    resultsModal.style.display = 'none';
    init();
});

init();