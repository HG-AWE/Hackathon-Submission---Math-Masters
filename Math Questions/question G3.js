const QUESTION = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submit');
const messageEl = document.getElementById('message');
const resultEl = document.getElementById('result');
const resultMsg = document.getElementById('result-message');

let correctAnswer;
let attempts = 3;

function generateQuestion() {
    let a, b;
    a = Math.floor(Math.random() * 8);
    b = Math.floor(Math.random() * 8);
    correctAnswer = a * b;
    return `What is ${a} × ${b}?`;
  } 

  function showResult(success) {
    document.getElementById('between-turn').classList.add('hidden');
    resultEl.classList.remove('hidden');
    if (success) {
      resultMsg.textContent = "Correct! Your character attacks!";
      setTimeout(function() {
        window.location.href = '/Hackathon-main/Hackathon/Tutorial/tutorial3.html';
      }, 1000); // 1 second delay
    } 
    else {
      resultMsg.textContent = "Out of attempts! The attack failed!";
    }
  }
  
  // Check if the tutorial is active
  const tutorialActive = localStorage.getItem('tutorialActive') === 'true';
  
  if (tutorialActive) {
      const tutorialMessage = document.createElement('p');
      tutorialMessage.textContent = "Solve this math problem to help your pet hit the monster!";
      tutorialMessage.style.fontWeight = 'bold';
      tutorialMessage.style.marginBottom = '20px';
  
      // Add the message to the math container or appropriate location
      const mathContainer = document.querySelector('.math-container');
      if (mathContainer) {
          mathContainer.prepend(tutorialMessage);
      }
  }
  
  submitBtn.addEventListener('click', () => {
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === correctAnswer) {
      localStorage.setItem('characterAttack', 'true'); // Set the attack flag
      localStorage.removeItem('tutorialActive'); // Clear the tutorial flag
      showResult(true);
    } 
    else {
      attempts--;
      if (attempts > 0) {
        messageEl.textContent = `Incorrect. You have ${attempts} attempt(s) left.`;
      } 
      else {
        showResult(false);
      }
    }
  });
  
  QUESTION.textContent = generateQuestion();
  
  
  answerInput.addEventListener('input', () => {
    // Remove any non-numeric characters from the input
    answerInput.value = answerInput.value.replace(/[^0-9]/g, '');
    
    if (answerInput.value) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  });
  
  answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submitBtn.click();
    }
  });
