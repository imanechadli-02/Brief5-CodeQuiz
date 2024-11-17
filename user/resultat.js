// Récupérer les résultats du quiz depuis localStorage
const quizResults = JSON.parse(localStorage.getItem('quizResults'));

if (quizResults) {
    // Afficher le score
    const scorePercentage = Math.round((quizResults.score / quizResults.totalQuestions) * 100);
    document.getElementById('scoreContainer').innerHTML = `<div>${scorePercentage}%</div>`;

    // Afficher le message de révision si nécessaire
    const revisionContainer = document.getElementById('revisionContainer');
    quizResults.questions.forEach(q => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `<b>${q.question}</b>`;

        const userAnswerDiv = document.createElement('div');
        userAnswerDiv.classList.add('answer');
        userAnswerDiv.innerHTML = `<i>Votre réponse :</i> <span class="${q.isCorrect ? 'correct-answer' : 'incorrect-answer'}">${q.userAnswer}</span>`;

        const correctAnswerDiv = document.createElement('div');
        correctAnswerDiv.classList.add('answer');
        correctAnswerDiv.innerHTML = `<i>Bonne réponse :</i> <span class="correct-answer">${q.correctAnswer}</span>`;

        questionDiv.appendChild(userAnswerDiv);
        questionDiv.appendChild(correctAnswerDiv);

        revisionContainer.appendChild(questionDiv);
    });
} else {
    alert("Aucun résultat trouvé.");
}

function goHome() {
    window.location.href = "../index.html"; // Rediriger vers la page d'accueil
}