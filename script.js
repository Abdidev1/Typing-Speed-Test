const wordBank = [
    "the", "quick", "brown", "fox", "jumps", "over","lazy", "dog", "javascript", "programming",
     "code", "developer","computer", "keyboard", "speed", "accuracy", "infinite","challange", "screen", "system",
     "application", "window", "universe", "galaxy", "science", "future", "history","learning", "practice", "perfect",
     "climb", "mountain", "river", "ocean", "forest", "journey", "adventure", "discovery", "knowledge", "power",
     "creative", "design", "imagine", "execute", "focus", "balance", "rythm", "steady","stream", "neverending"
]

let testDuration = 60;
let timeLeft = testDuration;
let timeerInterval = null;
let isTestRunning = false;

let generatedWords = [];
let currentWordIndex = 0;

let correctKeystrokes = 0;
let totalKeystrokes = 0;

const durationSelect = document.getElementById('duration-select');
const reserBtn = document.getElementById('reset-btn');
const timerVal = document.getElementById('timer-val');
const wpnVal = document.getElementById('wpn-val');
const accuracyVal = document.getElementById('accuracy-val');
const charsVal = document.getElementById('chars-val');
const textContainer = document.getElementById('text-container');
const displayBox = document.getElementById('display-box');
const inputField = document.getElementById('input-field');
const resultModal = document.getElementById('result-modal');
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

    inputField = '';
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
        textContainer.style.top = (currenrTop - 45) + 'px';
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