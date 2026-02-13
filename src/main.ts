import './style.css';
import { questions, type Question } from './data/questions';
import { saveReflection, getReflections, type Reflection } from './storage';

// State
let currentQuestion: Question;
let shuffledQuestions: Question[] = [];
let currentIndex = 0;
let isWritingMode = false;
let longPressTimer: number | null = null;
let touchStartX = 0;
let isDragging = false;
let currentDragX = 0;

// DOM Elements
const app = document.querySelector<HTMLDivElement>('#app')!;

// Initialize
function init(): void {
  render();
  initializeQuestions();
  currentQuestion = getCurrentQuestion();
  updateQuestion(currentQuestion, true);
  setupEventListeners();
}

function render(): void {
  app.innerHTML = `
    <button class="nav-reflections" aria-label="Gespeicherte Reflexionen anzeigen">Reflexionen</button>

    <header class="logo">
      Phoch<span class="logo-accent">3</span>
    </header>

    <main class="main-content">
      <div class="question-container" id="question-area">
        <p class="question" id="question-text"></p>
      </div>

      <div class="writing-mode" id="writing-mode">
        <textarea
          class="reflection-input"
          id="reflection-input"
          placeholder="Schreibe deine Reflexion..."
        ></textarea>
      </div>
    </main>

    <div class="actions">
      <button class="action-btn" id="new-question-btn">Neue Frage</button>
      <span class="action-divider">|</span>
      <button class="action-btn" id="save-btn" disabled>Speichern</button>
    </div>

    <footer class="footer">
      People · Passion · Performance
    </footer>

    <!-- Reflections List View -->
    <div class="reflections-view" id="reflections-view">
      <header class="reflections-header">
        <h2 class="reflections-title">Gespeicherte Reflexionen</h2>
        <button class="close-btn" id="close-reflections">Schließen</button>
      </header>
      <div class="reflections-list" id="reflections-list"></div>
    </div>

    <!-- Reflection Detail View -->
    <div class="reflection-detail" id="reflection-detail">
      <header class="reflections-header">
        <h2 class="reflections-title">Reflexion</h2>
        <button class="close-btn" id="close-detail">Zurück</button>
      </header>
      <div class="detail-content" id="detail-content"></div>
    </div>
  `;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function initializeQuestions(): void {
  shuffledQuestions = shuffleArray(questions);
  currentIndex = 0;
}

function getNextQuestion(): Question {
  currentIndex = (currentIndex + 1) % shuffledQuestions.length;
  return shuffledQuestions[currentIndex];
}

function getPreviousQuestion(): Question {
  currentIndex = (currentIndex - 1 + shuffledQuestions.length) % shuffledQuestions.length;
  return shuffledQuestions[currentIndex];
}

function getCurrentQuestion(): Question {
  return shuffledQuestions[currentIndex];
}

function updateQuestion(question: Question, isInitial = false): void {
  const questionEl = document.getElementById('question-text')!;

  // Fade out
  questionEl.classList.add('fade-out');

  setTimeout(() => {
    questionEl.textContent = question.text;
    questionEl.classList.remove('fade-out');
    questionEl.style.transform = '';

    // Show swipe hint animation on initial load
    if (isInitial) {
      questionEl.classList.add('hint-swipe');
      questionEl.addEventListener('animationend', () => {
        questionEl.classList.remove('hint-swipe');
      }, { once: true });
    }
  }, 250);
}

function showNextQuestion(): void {
  if (isWritingMode) return;
  currentQuestion = getNextQuestion();
  updateQuestion(currentQuestion);
}

function showPreviousQuestion(): void {
  if (isWritingMode) return;
  currentQuestion = getPreviousQuestion();
  updateQuestion(currentQuestion);
}

function toggleWritingMode(show: boolean): void {
  const writingModeEl = document.getElementById('writing-mode')!;
  const inputEl = document.getElementById('reflection-input') as HTMLTextAreaElement;

  isWritingMode = show;

  if (show) {
    writingModeEl.classList.add('active');
    inputEl.focus();
  } else {
    writingModeEl.classList.remove('active');
    inputEl.value = '';
    updateSaveButton();
  }
}

function updateSaveButton(): void {
  const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
  const inputEl = document.getElementById('reflection-input') as HTMLTextAreaElement;
  saveBtn.disabled = !inputEl.value.trim();
}

function handleSave(): void {
  const inputEl = document.getElementById('reflection-input') as HTMLTextAreaElement;
  const text = inputEl.value.trim();

  if (!text) return;

  saveReflection({
    questionId: currentQuestion.id,
    questionText: currentQuestion.text,
    reflectionText: text
  });

  toggleWritingMode(false);
  showNextQuestion();
}

function showReflectionsView(): void {
  const viewEl = document.getElementById('reflections-view')!;
  const listEl = document.getElementById('reflections-list')!;
  const reflections = getReflections();

  if (reflections.length === 0) {
    listEl.innerHTML = '<p class="empty-state">Noch keine Reflexionen gespeichert.<br>Lange auf eine Frage drücken, um zu schreiben.</p>';
  } else {
    listEl.innerHTML = reflections.map(r => `
      <div class="reflection-item" data-id="${r.id}">
        <p class="reflection-date">${formatDate(r.createdAt)}</p>
        <p class="reflection-question">${r.questionText}</p>
        <p class="reflection-preview">${r.reflectionText}</p>
      </div>
    `).join('');
  }

  viewEl.classList.add('active');
}

function hideReflectionsView(): void {
  document.getElementById('reflections-view')!.classList.remove('active');
}

function showReflectionDetail(reflection: Reflection): void {
  const detailEl = document.getElementById('reflection-detail')!;
  const contentEl = document.getElementById('detail-content')!;

  contentEl.innerHTML = `
    <p class="detail-date">${formatDate(reflection.createdAt)}</p>
    <h3 class="detail-question">${reflection.questionText}</h3>
    <p class="detail-reflection">${reflection.reflectionText}</p>
  `;

  detailEl.classList.add('active');
}

function hideReflectionDetail(): void {
  document.getElementById('reflection-detail')!.classList.remove('active');
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function setupEventListeners(): void {
  const questionArea = document.getElementById('question-area')!;
  const newQuestionBtn = document.getElementById('new-question-btn')!;
  const saveBtn = document.getElementById('save-btn')!;
  const reflectionInput = document.getElementById('reflection-input')!;
  const navReflections = document.querySelector('.nav-reflections')!;
  const closeReflections = document.getElementById('close-reflections')!;
  const closeDetail = document.getElementById('close-detail')!;
  const reflectionsList = document.getElementById('reflections-list')!;

  // New question button
  newQuestionBtn.addEventListener('click', showNextQuestion);

  // Save button
  saveBtn.addEventListener('click', handleSave);

  // Input change
  reflectionInput.addEventListener('input', updateSaveButton);

  // Tap on question area for new question
  questionArea.addEventListener('click', (e) => {
    if (!isWritingMode && e.target === questionArea || (e.target as Element).classList.contains('question')) {
      showNextQuestion();
    }
  });

  // Long press for writing mode
  questionArea.addEventListener('mousedown', startLongPress);
  questionArea.addEventListener('mouseup', cancelLongPress);
  questionArea.addEventListener('mouseleave', cancelLongPress);

  questionArea.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isDragging = false;
    currentDragX = 0;
    startLongPress();
  }, { passive: true });

  questionArea.addEventListener('touchend', (e) => {
    cancelLongPress();
    handleTouchEnd(e);
  });

  questionArea.addEventListener('touchmove', (e) => {
    handleTouchMove(e);
  }, { passive: true });

  // Close writing mode when clicking outside
  document.addEventListener('click', (e) => {
    if (isWritingMode) {
      const writingModeEl = document.getElementById('writing-mode')!;
      const target = e.target as Element;
      if (!writingModeEl.contains(target) &&
          !target.closest('#save-btn') &&
          !target.closest('#question-area')) {
        toggleWritingMode(false);
      }
    }
  });

  // Reflections navigation
  navReflections.addEventListener('click', showReflectionsView);
  closeReflections.addEventListener('click', hideReflectionsView);

  // Reflection item click
  reflectionsList.addEventListener('click', (e) => {
    const item = (e.target as Element).closest('.reflection-item');
    if (item) {
      const id = item.getAttribute('data-id');
      const reflections = getReflections();
      const reflection = reflections.find(r => r.id === id);
      if (reflection) {
        showReflectionDetail(reflection);
      }
    }
  });

  // Close detail
  closeDetail.addEventListener('click', hideReflectionDetail);

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('reflection-detail')!.classList.contains('active')) {
        hideReflectionDetail();
      } else if (document.getElementById('reflections-view')!.classList.contains('active')) {
        hideReflectionsView();
      } else if (isWritingMode) {
        toggleWritingMode(false);
      }
    }
  });
}

function startLongPress(): void {
  if (isWritingMode) return;
  longPressTimer = window.setTimeout(() => {
    toggleWritingMode(true);
  }, 500);
}

function cancelLongPress(): void {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

function handleTouchMove(e: TouchEvent): void {
  if (isWritingMode) return;

  const touchCurrentX = e.touches[0].clientX;
  const deltaX = touchCurrentX - touchStartX;

  // Only start dragging after moving more than 10px (to distinguish from tap)
  if (Math.abs(deltaX) > 10) {
    cancelLongPress();
    isDragging = true;

    const questionEl = document.getElementById('question-text')!;
    questionEl.classList.add('dragging');

    // Apply consistent drag resistance in both directions
    currentDragX = deltaX * 0.5;

    questionEl.style.transform = `translateX(${currentDragX}px)`;
  }
}

function handleTouchEnd(e: TouchEvent): void {
  const questionEl = document.getElementById('question-text')!;
  questionEl.classList.remove('dragging');

  if (isWritingMode) {
    questionEl.style.transform = '';
    return;
  }

  const touchEndX = e.changedTouches[0].clientX;
  const swipeDistance = touchStartX - touchEndX;

  if (isDragging) {
    // Swipe left (positive distance) -> next question
    if (swipeDistance > 50) {
      showNextQuestion();
    }
    // Swipe right (negative distance) -> previous question
    else if (swipeDistance < -50) {
      showPreviousQuestion();
    }
    // Not enough swipe -> snap back
    else {
      questionEl.style.transform = '';
    }
  } else {
    questionEl.style.transform = '';
  }

  isDragging = false;
  currentDragX = 0;
}

// Start the app
init();
