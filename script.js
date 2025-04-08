let startBtn = document.getElementById("start-btn");
let startScreen = document.getElementById("start-screen");
let container = document.querySelector(".container");

const gradeButtons = document.querySelectorAll('.grade-btn');

let grade1Btn = document.getElementById("grade-1-btn");
let grade2Btn = document.getElementById("grade-2-btn");
let grade3Btn = document.getElementById("grade-3-btn");
let grade4Btn = document.getElementById("grade-4-btn");
let grade5Btn = document.getElementById("grade-5-btn");

startBtn.onclick = function() {
    startScreen.style.visibility = "hidden";
    container.classList.add("expand"); // Trigger the animation to expand the container
    setTimeout(function() {
        grade1Btn.classList.add("fade-in"); // Apply the fade-in animation
        grade1Btn.style.visibility = "visible"; // Make button visible after 1 second
    }, 1000); // 1 second delay
    setTimeout(function() {
        grade2Btn.classList.add("fade-in"); // Apply the fade-in animation
        grade2Btn.style.visibility = "visible"; // Make button visible after 1 second
    }, 1200); // 1.2 second delay
    setTimeout(function() {
        grade3Btn.classList.add("fade-in"); // Apply the fade-in animation
        grade3Btn.style.visibility = "visible"; // Make button visible after 1 second
    }, 1400); // 1.4 second delay
    setTimeout(function() {
        grade4Btn.classList.add("fade-in"); // Apply the fade-in animation
        grade4Btn.style.visibility = "visible"; // Make button visible after 1 second
    }, 1600); // 1.6 second delay
    setTimeout(function() {
        grade5Btn.classList.add("fade-in"); // Apply the fade-in animation
        grade5Btn.style.visibility = "visible"; // Make button visible after 1 second
    }, 1800); // 1.8 second delay
};

grade1Btn.onclick = function() {
    window.location.href = "/Hackathon-main/Hackathon/Tutorial/tutorial1.html";
};
grade2Btn.onclick = function() {
    window.location.href = "/Hackathon-main/Hackathon/Tutorial/tutorial2.html";
};
grade3Btn.onclick = function() {
    window.location.href = "/Hackathon-main/Hackathon/Tutorial/tutorial3.html";
};
grade4Btn.onclick = function() {
    window.location.href = "/Hackathon-main/Hackathon/Tutorial/tutorial4.html";
};
grade5Btn.onclick = function() {
    window.location.href = "/Hackathon-main/Hackathon/Tutorial/tutorial5.html";
};