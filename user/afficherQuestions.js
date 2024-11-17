const data = {
    "quizzes": [
        {
            "name": "Mon premier quiz",
            "questions": [
                {
                    "question": "Quelle est la capitale de la France ?",
                    "type": "choix",
                    "options": ["Paris", "Londres", "Berlin", "Madrid"],
                    "correctAnswer": "Paris"
                },
                {
                    "question": "Le soleil est-il une étoile ?",
                    "type": "trueFalse",
                    "correctAnswer": "Vrai"
                },
                {
                    "question": "De quelle couleur est le ciel ?",
                    "type": "textuelle",
                    "correctAnswer": "Bleu"
                }
            ]
        }
    ]
};

const quizName = data.quizzes[0].name;
const Questions = data.quizzes[0].questions;
const qstcontainer = document.getElementById("question-container");
const nbrqstDisplay = document.getElementById("nbrqst");
const progressBar = document.getElementById("progressBar");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.querySelector(".score"); // Sélection du div score
let currentQuestionIndex = 0;
let timerInterval;
let timeLeft = 60; // 1 minute per question
let resultData = {
    score: 0,
    totalQuestions: Questions.length,
    questions: []
};

function showQuestion() {
    clearInterval(timerInterval); // Clear previous timer
    timeLeft = 60; // Reset timer for the new question

    qstcontainer.innerHTML = "";
    const qst = Questions[currentQuestionIndex];
    nbrqstDisplay.textContent = currentQuestionIndex + 1;
    const card = document.createElement("div");
    card.classList.add('laQuestion');

    card.innerHTML = `<h3>${quizName}</h3><div class="question">${qst.question}</div>`;

    if (qst.type === "choix") {
        const optionsHTML = qst.options.map(option =>
            `<div class="repo">${option}</div>`
        ).join('');
        card.innerHTML += `<div class="reponse">${optionsHTML}</div>`;
    } else if (qst.type === "textuelle") {
        card.innerHTML += `<input type="text" id="textAnswer" placeholder="Entrez votre réponse...">`;
    } else if (qst.type === "trueFalse") {
        card.innerHTML += `
            <div class="reponse">
                <div class="repo">Vrai</div>
                <div class="repo">Faux</div>
            </div>`;
    }

    card.innerHTML += `<button class="btn-submit" id="submitBtn">Valider</button>`;
    card.innerHTML += `<button class="btn-next" id="nextBtn">Suivant</button>`;
    qstcontainer.appendChild(card);

    const submitBtn = card.querySelector("#submitBtn");
    submitBtn.style.display = "block";
    submitBtn.addEventListener('click', () => validateAnswer(qst, card));

    const nextBtn = card.querySelector("#nextBtn");
    nextBtn.style.display = "none";
    nextBtn.addEventListener('click', showNextQuestion);

    const allOptions = card.querySelectorAll('.repo');
    allOptions.forEach(option => {
        option.addEventListener('click', () => selectOption(option));
    });

    startTimer(); // Start the timer for the question
    updateProgressBar(); // Update progress bar after displaying the question
}

function validateAnswer(qst, card) {
    let isCorrect = false;
    let userAnswer = "";

    if (qst.type === "choix" || qst.type === "trueFalse") {
        const selectedOption = card.querySelector('.repo.selected');
        if (selectedOption) {
            userAnswer = selectedOption.innerText;
            isCorrect = userAnswer === qst.correctAnswer;
            selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');
            if (!isCorrect) {
                const correctOption = [...card.querySelectorAll('.repo')]
                    .find(option => option.innerText === qst.correctAnswer);
                correctOption.classList.add('correct-answer'); // Bonne réponse en vert
            }
        } else {
            alert("Veuillez sélectionner une option !");
            return;
        }
    } else if (qst.type === "textuelle") {
        const inputField = card.querySelector("#textAnswer");
        userAnswer = inputField.value.trim().toLowerCase();
        isCorrect = userAnswer === qst.correctAnswer.trim().toLowerCase();
        inputField.classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!userAnswer) {
            alert("Veuillez entrer une réponse !");
            return;
        }
        if (!isCorrect) {
            const correctAnswerDiv = document.createElement('div');
            correctAnswerDiv.classList.add('correct-answer');
            correctAnswerDiv.textContent = `La bonne réponse est : ${qst.correctAnswer}`;
            card.appendChild(correctAnswerDiv);
        }
    }

    // Enregistrer la réponse dans resultData
    resultData.questions.push({
        question: qst.question,
        userAnswer: userAnswer,
        correctAnswer: qst.correctAnswer,
        isCorrect: isCorrect
    });

    if (isCorrect) {
        resultData.score++;
        updateScoreDisplay(); // Met à jour l'affichage du score
    }

    clearInterval(timerInterval); // Stop timer once validated
    card.querySelector("#submitBtn").disabled = true;
    card.querySelector("#nextBtn").style.display = "block"; // Afficher le bouton "Suivant"
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${resultData.score}`;
}

function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < Questions.length) {
        showQuestion(); // Affiche la question suivante
    } else {
        // Fin du quiz, on prépare la redirection
        const quizResults = {
            score: resultData.score,
            totalQuestions: Questions.length,
            questions: resultData.questions
        };

        // Sauvegarder les résultats dans localStorage
        localStorage.setItem('quizResults', JSON.stringify(quizResults));

        // Rediriger vers la page des résultats
        window.location.href = "resultat.html"; // Redirection vers la page des résultats
    }
}

function startTimer() {
    timerDisplay.textContent = "01:00"; // Initial timer display
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showNextQuestion(); // Move to next question if time runs out
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);
}

function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex + 1) / Questions.length) * 100;
    progressBar.style.width = progressPercentage + '%';
}

function selectOption(option) {
    const allOptions = option.parentNode.querySelectorAll('.repo');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
}

// Start the quiz
showQuestion();
