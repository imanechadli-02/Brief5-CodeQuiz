fetch('quizes.json')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Check the fetched quiz data

                const quizContainer = document.getElementById("cards-container");

                data.quizzes.forEach(quiz => {
                    const card = document.createElement("div");
                    card.classList.add('card1');
                    card.innerHTML = `
                        <div class="parag">
                            <h3>${quiz.name}</h3>
                            <h3>Level: ${quiz.level}</h3>
                            <h3>Nombre de questions: ${quiz.questions.length}</h3>
                            <h3>Temps estimé</h3>
                            <button class="start-btn" onclick="startQuiz('${quiz.name}')">Démarrer</button>
                        </div>
                        <img src="../images/histoiresvg.svg" alt="">`;

                    quizContainer.appendChild(card);
                });
            });

        function startQuiz(quizName) {
            fetch('quizes.json')
                .then(response => response.json())
                .then(data => {
                    const selectedQuiz = data.quizzes.find(quiz => quiz.name === quizName);
                    localStorage.setItem('selectedQuiz', JSON.stringify(selectedQuiz));
                    window.location.href = 'afficherQuestions.html';
                });
        }