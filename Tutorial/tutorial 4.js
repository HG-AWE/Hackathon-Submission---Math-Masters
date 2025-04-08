'use strict';

// DOM elements
const TUTORIAL_TEXT = document.getElementById('tutorial-text');
const NEXT_BUTTON = document.getElementById('next-button');
const CHARACTER_CONTAINER = document.getElementById('character-container');
const CHARACTER_IMAGE_CONTAINER = document.createElement('div');
const ENEMY_IMAGE_CONTAINER = document.createElement('div');
const BATTLE_CONTAINER = document.getElementById('battle-container');
const MATH_CONTAINER = document.querySelector('.math-container');

const HIT_BUTTON = document.getElementById('hit-button');
const BLOCK_BUTTON = document.getElementById('block-button');

const REST_BUTTON = document.getElementById('rest-button');

const HEALTH_BAR_UI = document.querySelector('.health-bar');
const ENEMY_HEALTH_UI = document.getElementById('empty-health-container-enemy');
const CHAR_HEALTH_UI = document.getElementById('empty-health-container-character');
const BATTLE_BUTTONS = document.querySelector('.battle-buttons');


const CHARACTER_HEALTH = document.getElementById('character-health');
const ENEMY_HEALTH = document.getElementById('enemy-health');
const MAX_HP = 100;

// Game state
let tutorialMessages = [];
let currentSlide = 0;
let speechSynth = window.speechSynthesis;
let utterance;
let selectedCharacter;
let currentHp = MAX_HP;
let enemyHp = MAX_HP;

// Initialize image containers
CHARACTER_IMAGE_CONTAINER.id = 'character-image-container';
ENEMY_IMAGE_CONTAINER.id = 'enemy-image-container';
document.querySelector('.math-container').appendChild(CHARACTER_IMAGE_CONTAINER);
document.querySelector('.math-container').appendChild(ENEMY_IMAGE_CONTAINER);

// Make sure character container is visible at start
CHARACTER_CONTAINER.style.display = 'none';

// Debug button
const debugButton = document.createElement('button');
debugButton.textContent = 'Reset Storage';
debugButton.style.position = 'absolute';
debugButton.style.top = '10px';
debugButton.style.left = '10px';
debugButton.style.zIndex = '1000';
debugButton.style.padding = '10px';
debugButton.style.backgroundColor = '#f44336';
debugButton.style.color = '#fff';
debugButton.style.border = 'none';
debugButton.style.borderRadius = '5px';
debugButton.style.cursor = 'pointer';
document.body.appendChild(debugButton);
debugButton.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Enemy character
const enemyCharacter = {
    name: "Wild Buddy",
    image: "/Hackathon-main/Hackathon/assets/images/duckzilla.png"
};

function showEnemyImage(position = 'right') {
    let style = '';
    if (position === 'right') {
        style = 'position: absolute; top: -260px; right: 10px; width: 150px';
    } else {
        style = 'position: absolute; top: 100px; left: 300px;';
    }
    
    ENEMY_IMAGE_CONTAINER.innerHTML = `
        <img src="${enemyCharacter.image}" 
             alt="${enemyCharacter.name}" 
             class="enemy-image"
             style="${style}">
    `;
}

function hideEnemyImage() {
    ENEMY_IMAGE_CONTAINER.innerHTML = '';
}

// Character data
const characters = [
    { 
        name: "Frog", 
        emoji: "🐸", 
        color: "#4CAF50",
        sound: "assets/sounds/frog.mp3",
        image: "/Hackathon-main/Hackathon/assets/images/frog_img.gif" 
    },
    { 
        name: "Butterfly", 
        emoji: "🦋", 
        color: "#9370DB",
        sound: "/assets/sounds/butterfly.mp3",
        image: "/Hackathon-main/Hackathon/assets/images/butterfly_img.png" 
    },
    { 
        name: "Bunny", 
        emoji: "🐰", 
        color: "#FFC0CB",
        sound: "/assets/sounds/bunny.mp3",
        image: "/Hackathon-main/Hackathon/assets/images/bunny_img.png"
    }
];

function hideCharacterImage() {
    CHARACTER_IMAGE_CONTAINER.innerHTML = '';
}

function showCharacterImage(character, position = 'left') {
    let style = ''; 
    if (position === 'slideIndex6') {
        style = 'position: absolute; top: -36vh; right: 86%; width: 150px;';
    }

    CHARACTER_IMAGE_CONTAINER.innerHTML = `
        <img src="${character.image}" 
             alt="${character.name}" 
             class="character-image"
             style="${style}">
    `;
}



function checkCharacterAttack() {
    const attackFlag = localStorage.getItem('characterAttack');
    if (attackFlag === 'true') {
        // Trigger the character attack animation after a delay
        setTimeout(() => {
            const characterImage = CHARACTER_IMAGE_CONTAINER.querySelector('.character-image');
            if (characterImage) {
                characterImage.classList.add('attack-animation'); // Add an attack animation class
            }

            // Attack the enemy
            attackEnemy(25); // Deal 25 damage to the enemy

            // Clear the attack flag
            localStorage.removeItem('characterAttack');

            // Trigger the enemy attack after 2 seconds
            setTimeout(() => {
                enemyAttack(10);
            }, 1500); // 1.5-second delay
        }, 1300); // 500ms delay before the attack animation starts
    }
}

function attackEnemy(characterDamage) {
    const enemyHealthBar = document.getElementById('enemy-health'); // Explicitly target the enemy's health bar
    if (enemyHealthBar) {
        enemyHp -= characterDamage; // Reduce enemy health by the specified damage
        if (enemyHp < 0) enemyHp = 0; // Ensure health doesn't go below 0

        // Calculate the remaining health percentage
        const remainingHealthPercentage = (enemyHp / MAX_HP) * 10;
        enemyHealthBar.style.width = `${remainingHealthPercentage}%`; // Update the health bar width

        updateHealthBarColor('enemy', enemyHp); // Update the enemy's health bar color

        // Add hit animation to the enemy's health bar
        enemyHealthBar.classList.add('hit-animation');
        setTimeout(() => {
            enemyHealthBar.classList.remove('hit-animation'); // Remove the animation class after it finishes
        }, 300); // Match the duration of the animation

        // Save the updated health to localStorage
        localStorage.setItem('enemyHealth', enemyHp);

        // Check if the enemy's health is 0 and display the victory pop-up
        checkWinCondition();
    }
}

function enemyAttack(enemyDamage) {
    const attackFlag = localStorage.getItem('enemyAttack') === 'true';
    if (attackFlag) {
        // Trigger the enemy attack animation
        const enemyImage = ENEMY_IMAGE_CONTAINER.querySelector('.enemy-image');
        if (enemyImage) {
            enemyImage.classList.add('attack-animation'); // Add an attack animation class
        }

        // Reduce the player's health after the attack
        setTimeout(() => {
            getHitByEnemy(enemyDamage); // Deal 20 damage to the player

            // Remove the attack animation after it finishes
            if (enemyImage) {
                enemyImage.classList.remove('attack-animation');
            }

            // Reset the attack flag
            localStorage.setItem('enemyAttack', 'false');
        }, 1000); // Delay for the attack animation (1 second)
    }
}

function getHitByEnemy(enemyDamage) {
    const characterHealthBar = document.getElementById('character-health'); // Explicitly target the character's health bar
    if (characterHealthBar) {
        currentHp -= enemyDamage; // Reduce player's health by the specified damage
        if (currentHp < 0) currentHp = 0; // Ensure health doesn't go below 0

        // Calculate the remaining health percentage
        const remainingHealthPercentage = (currentHp / MAX_HP) * 10;
        characterHealthBar.style.width = `${remainingHealthPercentage}%`; // Update the health bar width

        updateHealthBarColor('character', currentHp); // Update the character's health bar color

        // Add hit animation to the player's health bar
        characterHealthBar.classList.add('hit-animation');
        setTimeout(() => {
            characterHealthBar.classList.remove('hit-animation'); // Remove the animation class after it finishes
        }, 300); // Match the duration of the animation

        saveHealth(); // Save the updated health to localStorage
    }
}

// Save health values to localStorage
function saveHealth() {
    localStorage.setItem('characterHealth', currentHp);
    localStorage.setItem('enemyHealth', enemyHp);
}

// Load health values from localStorage
function loadHealth() {
    // Load character health
    const savedCharacterHealth = localStorage.getItem('characterHealth');
    if (savedCharacterHealth !== null) {
        currentHp = parseInt(savedCharacterHealth, 10);
        const characterHealthBar = CHARACTER_HEALTH;
        if (characterHealthBar) {
            characterHealthBar.style.width = `${(currentHp / MAX_HP) * 10}%`; // Update the health bar width
            updateHealthBarColor(); // Update the health bar color
        }
    }

    // Load enemy health
    const savedEnemyHealth = localStorage.getItem('enemyHealth');
    if (savedEnemyHealth !== null) {
        enemyHp = parseInt(savedEnemyHealth, 10);
        const enemyHealthBar = ENEMY_HEALTH;
        if (enemyHealthBar) {
            enemyHealthBar.style.width = `${(enemyHp / MAX_HP) * 10}%`; // Update the health bar width
            updateHealthBarColor(); // Update the health bar color
        }
    }
}

// Update health bar colors based on health values
function updateHealthBarColor(type, health) {
    const healthBar = type === 'character' ? document.getElementById('character-health') : document.getElementById('enemy-health');

    if (health > 60) {
        healthBar.style.backgroundColor = 'green'; // Healthy
    } else if (health > 30) {
        healthBar.style.backgroundColor = 'orange'; // Warning
    } else if (health > 0) {
        healthBar.style.backgroundColor = 'red'; // Critical
    }
}

// Character selection
function setupCharacterSelection() {
    const characterButtons = document.querySelectorAll('.character-btn');
    
    characterButtons.forEach((button, index) => {
        const character = characters[index];
        
        button.addEventListener('click', () => {
            selectedCharacter = character;
        
            // Save the selected character to localStorage
            localStorage.setItem('selectedCharacter', JSON.stringify(selectedCharacter));
        
            // Update UI
            characterButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
        
            speakMessage(`You chose ${selectedCharacter.name}!`);
        });
    });
}

// Message management
function loadMessages() {
    tutorialMessages = [
        "Welcome to Math Masters! Let's learn math with fun animal friends!",
        "First, let's find you a pet buddy to help you!",
        "Click on a pet to choose your learning buddy."
    ];

    if (selectedCharacter) {
        tutorialMessages.push(`Great choice! Your ${selectedCharacter.name} ${selectedCharacter.emoji} will help you!`);
    } 
    
    tutorialMessages.push("Now that you have a friend to join you on your adventure, lets teach you how to battle with them!");
    tutorialMessages.push("Look! That's a wild buddy.");
    tutorialMessages.push("And this is your buddy");

    tutorialMessages.push(
        "You can do one of the actions on the right",
        "Let's try the 'hit' button",
        "Wow! Good job! Now your buddy is ready to hit the enemy. Let's watch them go!",
        "Did you see that?",
        "That's the wild buddy's health. If their health runs out, you win!",
        "But be careful, because your buddy can also run out of health.",
        "Now it's your turn to act. Good luck!"
    );
}

function loadSelectedCharacter() {
    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter) {
        selectedCharacter = JSON.parse(savedCharacter);
    }
}

// Navigation
function nextMessage() {
    if (currentSlide === 1) {
        CHARACTER_CONTAINER.style.display = 'flex';
    }
    
    if (currentSlide === 2 && !selectedCharacter) {
        speakMessage("Please choose a character first!");
        return;
    }
    
    currentSlide = (currentSlide + 1) % tutorialMessages.length;
    loadMessages();
    displayMessage();
    
    if (currentSlide !== 2) {
        CHARACTER_CONTAINER.style.display = "none";
    }
}

// Display functions
function displayMessage() {
    TUTORIAL_TEXT.innerHTML = tutorialMessages[currentSlide];
    speakMessage(tutorialMessages[currentSlide]);
    
    // Clear both images by default
    hideCharacterImage();
    hideEnemyImage();
    
    // Show appropriate images based on slide
    if (selectedCharacter) {
        if (currentSlide >= 7) {
            BATTLE_BUTTONS.style.display = 'block';
        }
        
        if (currentSlide >= 6) {
            // and this is your buddy text
            showCharacterImage(selectedCharacter, 'slideIndex6');
            HEALTH_BAR_UI.style.display = 'block';
            CHAR_HEALTH_UI.style.display = "block";
        }
        if (currentSlide >= 5) {
            showEnemyImage('right');
            ENEMY_HEALTH_UI.style.display = "block";
            ENEMY_HEALTH.style.display = "block";
        }
    }
    
    // Show character selection buttons on slide 1 and 2
    if (currentSlide === 1 || currentSlide === 2) {
        CHARACTER_CONTAINER.style.display = 'flex';
    } 
    else {
        CHARACTER_CONTAINER.style.display = 'none';
    }
    
    // Show battle interface starting from slide 5
    if (currentSlide >= 5) {
        BATTLE_CONTAINER.style.display = 'block'; 
        MATH_CONTAINER.style.marginTop = '80px';
    } 
    else {
        BATTLE_CONTAINER.style.display = 'none'; 
        MATH_CONTAINER.style.marginTop = '0';
    }
}

// Speech functions
function speakMessage(text) {
    speechSynth.cancel();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    
    const voices = speechSynth.getVoices();
    const childVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Child'));
    if (childVoice) utterance.voice = childVoice;
    
    speechSynth.speak(utterance);
}

// Local storage functions
function saveTutorialStage() {
    localStorage.setItem('currentSlide', currentSlide);
}

function loadTutorialStage() {
    const savedSlide = localStorage.getItem('currentSlide');
    if (savedSlide !== null) {
        currentSlide = parseInt(savedSlide, 10);
    } else {
        currentSlide = 0;
    }
}

function checkWinCondition() {
    if (enemyHp <= 0) {
        // Create the pop-up container
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = '#fff';
        popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        popup.style.border = '7px solid #000'; 
        popup.style.borderRadius = '10px';
        popup.style.textAlign = 'center';
        popup.style.zIndex = '1000';
        popup.style.width = '90%'; 
        popup.style.height = '70%';
        popup.style.boxSizing = 'border-box'; // Ensure padding is included in the width

        // Add the victory message
        const message = document.createElement('p');
        message.textContent = "You've won!";
        message.style.fontSize = '10rem';
        message.style.fontWeight = 'bold';
        message.style.marginBottom = '30px';
        message.style.textAlign = 'center';
        message.style.color = '#e63946'; // a strong red tone
        message.style.letterSpacing = '1.5px';
        message.style.fontFamily = `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        message.style.textShadow = '2px 2px 5px rgba(0,0,0,0.3)';
        
        
    
        popup.appendChild(message);

        // Add the button to go back to the index page
        const button = document.createElement('button');
        button.textContent = 'Go to Home';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
            window.location.href = '/Hackathon-main/Hackathon/index.html';
        });
        popup.appendChild(button);

        // Append the pop-up to the body
        document.body.appendChild(popup);
    }
}

// Initialize the tutorial
function startTutorial() {
    loadTutorialStage();
    loadSelectedCharacter();
    loadHealth(); // Load health values from localStorage
    setupCharacterSelection();

    speechSynth.onvoiceschanged = function () {
        loadMessages();
        displayMessage();
        checkCharacterAttack(); // Check for the attack flag
        NEXT_BUTTON.addEventListener('click', nextMessage);
    };

    if (speechSynth.getVoices().length > 0) {
        speechSynth.onvoiceschanged();
    }
}
// Save health and navigate to the question page
HIT_BUTTON.addEventListener('click', () => {
    saveHealth(); // Save health before navigating
    saveTutorialStage();
    localStorage.setItem('tutorialActive', 'true');
    window.location.href = "/Hackathon-main/Hackathon/Math Questions/question G4.html";

    // Trigger the enemy attack after the player's action
    localStorage.setItem('enemyAttack', 'true');
    setTimeout(() => {
        enemyAttack(); // Call the enemy attack function
    }, 2000); // Delay the enemy attack by 2 seconds
});

startTutorial();
updateHealthBarColor('character', currentHp);
updateHealthBarColor('enemy', enemyHp);

