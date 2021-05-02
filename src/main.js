const header = document.getElementById('header');
const selection = document.getElementById('selection');
const questionArea = document.getElementById('question');
const quiz = document.getElementById('quiz');

const startView = document.getElementById('startView');
const startButton = document.getElementById('start');

const questionParam = document.getElementById('questionParam');
const questionText = document.getElementById('questionText');

const finalArea = document.getElementById('final');

const numberQuestions = 10;

class quizSettings {
  constructor() {
    this.url = 'https://opentdb.com/api.php?amount=10&type=multiple';
    this.quiz = {};

    startButton.addEventListener('click', () => {
      header.innerText = '取得中';
      questionText.innerText = '少々お待ちください。';
      this.startQuiz(this);
    });
  }

  async startQuiz() {
    this.toggleVisibility();
    const data = await this.fetchQuizData();
    this.quiz = new Quiz(quiz, data.results);
  }

  fetchQuizData() {
    return fetch(this.url)
      .then((response) => {
        return response.json();
      })
      .catch((error) => alert(error));
  }

  toggleVisibility() {
    startView.classList.add('hidden');
    quiz.classList.remove('hidden');
  }
}

class Question {
  constructor(question) {
    this.category = question.category;
    this.difficulty = question.difficulty;
    this.question = question.question;
    this.correctAnswer = question.correct_answer;

    this.isCorrect = false;
    this.answers = this.shuffleAnswers([question.correct_answer, ...question.incorrect_answers]);
  }

  shuffleAnswers(answers) {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = answers[i];
      answers[i] = answers[j];
      answers[j] = temp;
    }
    return answers;
  }

  answer(value) {
    this.isCorrect = value === this.correctAnswer ? true : false;
  }

  render() {
    questionText.innerHTML = this.question;

    questionParam.innerHTML = '';
    const categoryElement = document.createElement('span');
    categoryElement.innerText = '[ジャンル]' + this.category;
    const difficultyElement = document.createElement('span');
    difficultyElement.innerText = '[難易度]' + this.difficulty;
    questionParam.append(categoryElement);
    questionParam.append(difficultyElement);

    this.answers.forEach((el, index) => {
      const button = document.createElement('button');
      const text = this.answers[index];
      button.innerText = text;
      button.setAttribute('value', text);
      button.classList.add('answer');
      selection.append(button);
    });
  }
}

class Quiz {
  constructor(quizElement, questions) {
    this.quizElement = quizElement;

    this.totalAmount = numberQuestions;
    this.answeredAmount = 0;
    this.questions = this.setQuestions(questions);
    this.renderQuestion();
  }

  setQuestions(questions) {
    return questions.map((question) => new Question(question));
  }

  renderQuestion() {
    selection.innerHTML = '';
    this.questions[this.answeredAmount].render();
    header.innerText = '問題' + Number(this.answeredAmount + 1);

    this.nextButton = document.querySelectorAll('.answer');
    this.nextButton.forEach((button) => {
      button.addEventListener('click', this.nextQuestion.bind(this));
    });
  }

  nextQuestion(button) {
    this.correct = button.target.value;
    this.questions[this.answeredAmount].answer(this.correct);
    this.answeredAmount++;
    this.answeredAmount < this.totalAmount ? this.renderQuestion() : this.endQuiz();
  }

  endQuiz() {
    this.quizElement.classList.add('hidden');
    finalArea.classList.remove('hidden');
    const correctAnswersTotal = this.calculateCorrectAnswers();
    this.final = new Final(correctAnswersTotal);
  }

  calculateCorrectAnswers() {
    let count = 0;
    this.questions.forEach((el) => {
      if (el.isCorrect) {
        count++;
      }
    });
    return count;
  }
}

class Final {
  constructor(count) {
    this.againButton = document.getElementById('again');

    this.render(count);
    this.againButton.addEventListener('click', location.reload.bind(location));
  }

  render(count) {
    header.innerText = `あなたの正答数は${count}です!!`;
  }
}

new quizSettings();
