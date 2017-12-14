'use strict';

/* global $*/


const TOP_LEVEL_COMPONENTS = [
    'js-intro', 'js-question', 'js-question-feedback', 'js-outro', 'js-quiz-status'
];

const QUESTIONS = [
    {
        text: 'Capital of England?',
        answers: ['London', 'Paris', 'Rome', 'Washington DC'],
        correctAnswer: 'London'
    },
    {
        text: 'How many kilometers in one mile?',
        answers: ['0.6', '1.2', '1.6', '1.8'],
        correctAnswer: '1.6'
    }
];

const getInitialStore = function() {
    console.log('getInitialStore');
    return {
        page: 'intro',
        currentQuestionIndex: null,
        userAnswers: [],
        feedback: null
    };
};

let store = getInitialStore();

// Helper functions
// ===============
const hideAll = function() {
    TOP_LEVEL_COMPONENTS.forEach(component => $(`.${component}`).hide());
};

const getScore = function() {
    console.log('getScore');
    //dont know how this gets score. dont get reduce func
    return store.userAnswers.reduce((accumulator, userAnswer, index) => {
        const question = getQuestion(index);
        console.log(question);
        console.log(userAnswer);
        if (question.correctAnswer === userAnswer) {
            return accumulator + 1;
        } else {
            return accumulator;
        }
    }, 0);
};

const getProgress = function() {
    console.log('getProgress');
    return {
        current: store.currentQuestionIndex + 1,
        total: QUESTIONS.length
    };
};

const getCurrentQuestion = function() {
    console.log('getCurrentQuestion; runs in render to reflect change in store.---index'
    + 'well get question-index not question');
    return QUESTIONS[store.currentQuestionIndex];
};

const getQuestion = function(index) {
    console.log('getQuestion - seperation of code runs during getScore; to get all correctAnswer-count');
    return QUESTIONS[index];
};

// HTML generator functions
// ========================
const generateAnswerItemHtml = function(answer) {
    console.log('generateAnswerItemHtml');
    return `
    <li class="answer-item">
      <input type="radio" name="answers" value="${answer}" />
      <span class="answer-text">${answer}</span>
    </li>
  `;
};

const generateQuestionHtml = function(question) {
    console.log('generateQuestionHtml');
    const answers = question.answers
        .map((answer, index) => generateAnswerItemHtml(answer, index))
        .join('');

    return `
    <form>
      <fieldset>
        <legend class="question-text">${question.text}</legend>
          ${answers}
          <button type="submit">Submit</button>
      </fieldset>
    </form>
  `;
};

const generateFeedbackHtml = function(feedback) {
    console.log('generateFeedbackHtml');
    return `
    <p>${feedback}</p>
    <button class="continue js-continue">Continue</button>
  `;
};

// Render function - uses `store` object to construct entire page every time it's run
// ===============
const render = function() {
    console.log('render!!!');
    let html;
    hideAll();

    const question = getCurrentQuestion();
    const { feedback } = store;
    const { current, total } = getProgress();

    $('.js-score').html(`<span>Score: ${getScore()}</span>`);
    $('.js-progress').html(`<span>Question ${current} of ${total}`);

    //switch looks at the value of page. which
    //technically a view.
    switch (store.page) {
    case 'intro':
        $('.js-intro').show();
        console.log('-- end -- ');
        break;

    case 'question':
        html = generateQuestionHtml(question);
        $('.js-question').html(html);
        $('.js-question').show();
        $('.quiz-status').show();
        console.log('-- end -- ');
        break;

    case 'answer':
        html = generateFeedbackHtml(feedback);
        $('.js-question-feedback').html(html);
        $('.js-question-feedback').show();
        $('.quiz-status').show();
        console.log('-- end -- ');
        break;

    case 'outro':
        $('.js-outro').show();
        $('.quiz-status').show();
        console.log('-- end -- ');
        break;

    default:
        return;


    }
};

// Event handler functions
// =======================
const handleStartQuiz = function() {
    console.log('-- start --');
    console.log('handleStartQuiz');
    store = getInitialStore();
    store.page = 'question';
    store.currentQuestionIndex = 0;
    //call our data & populate.
    //cant start render() yet so another func w/ callback
    render();
};

const handleSubmitAnswer = function(e) {
    console.log('-- start --');
    console.log('handleSumbitQuiz');
    e.preventDefault();
    const question = getCurrentQuestion();
    const selected = $('input:checked').val();
    store.userAnswers.push(selected);

    if (selected === question.correctAnswer) {
        store.feedback = 'You got it!';
    } else {
        store.feedback = `Too bad! The correct answer was: ${question.correctAnswer}`;
    }

    store.page = 'answer';
    render();
};

const handleNextQuestion = function() {
    console.log('-- start --');
    console.log('handleNextQuestion');
    if (store.currentQuestionIndex === QUESTIONS.length - 1) {
        store.page = 'outro';
        render();
        return;
    }

    store.currentQuestionIndex++;
    store.page = 'question';
    render();
};

// On DOM Ready, run render() and add event listeners
$(() => {
    console.log('-- start --');
    render();
    //callbacks are the last arguments
    $('.js-intro, .js-outro').on('click', '.js-start', handleStartQuiz);
    $('.js-question').on('submit', handleSubmitAnswer);
    $('.js-question-feedback').on('click', '.js-continue', handleNextQuestion);
});
