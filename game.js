// Node.js modules (available due to nodeIntegration: true)
const fs = require('fs');
const path = require('path');

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GROUND_HEIGHT = 100;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;

// Game state
let gameState = 'MENU'; // MENU, PLAYING, PAUSED, GAME_OVER
let currentDifficulty = 'normal';
let score = 0;
let highScores = { easy: 0, normal: 0, hard: 0 };
let soundEnabled = true;

// Game objects
let bird = {};
let pipes = [];
let gameSpeed = 2;

// Canvas and context
let canvas, ctx;

// Difficulty settings
const difficultySettings = {
    easy: { pipeGap: 180, gameSpeed: 1.5, pipeSpacing: 300 },
    normal: { pipeGap: 150, gameSpeed: 2, pipeSpacing: 250 },
    hard: { pipeGap: 120, gameSpeed: 2.5, pipeSpacing: 200 }
};

// Sound effects (simple beep sounds using Web Audio API)
let audioContext;
let sounds = {};

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Initialize audio context
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createSounds();
    } catch (e) {
        console.log('Audio not supported');
        soundEnabled = false;
    }
    
    // Load high scores
    loadHighScores();
    updateHighScoreDisplay();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start game loop
    gameLoop();
}

// Create simple beep sounds using Web Audio API
function createSounds() {
    sounds.flap = () => playBeep(300, 0.1);
    sounds.score = () => playBeep(500, 0.2);
    sounds.hit = () => playBeep(150, 0.3);
}

function playBeep(frequency, duration) {
    if (!soundEnabled || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// High score persistence using Node.js fs module
function loadHighScores() {
    try {
        const scoresPath = path.join(__dirname, 'scores.json');
        if (fs.existsSync(scoresPath)) {
            const data = fs.readFileSync(scoresPath, 'utf8');
            highScores = JSON.parse(data);
        }
    } catch (error) {
        console.log('Could not load high scores:', error);
        highScores = { easy: 0, normal: 0, hard: 0 };
    }
}

function saveHighScores() {
    try {
        const scoresPath = path.join(__dirname, 'scores.json');
        fs.writeFileSync(scoresPath, JSON.stringify(highScores, null, 2));
    } catch (error) {
        console.log('Could not save high scores:', error);
    }
}

function updateHighScoreDisplay() {
    document.getElementById('highScoreEasy').textContent = highScores.easy;
    document.getElementById('highScoreNormal').textContent = highScores.normal;
    document.getElementById('highScoreHard').textContent = highScores.hard;
}

// Event listeners
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Menu buttons
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('easyBtn').addEventListener('click', () => selectDifficulty('easy'));
    document.getElementById('normalBtn').addEventListener('click', () => selectDifficulty('normal'));
    document.getElementById('hardBtn').addEventListener('click', () => selectDifficulty('hard'));
    
    // Pause screen buttons
    document.getElementById('resumeBtn').addEventListener('click', resumeGame);
    document.getElementById('menuBtn').addEventListener('click', showMenu);
    
    // Game over screen buttons
    document.getElementById('restartBtn').addEventListener('click', startGame);
    document.getElementById('mainMenuBtn').addEventListener('click', showMenu);
    
    // Sound toggle
    document.getElementById('soundStatus').addEventListener('click', toggleSound);
}

function handleKeyPress(event) {
    switch (event.code) {
        case 'Space':
        case 'ArrowUp':
            event.preventDefault();
            if (gameState === 'PLAYING') {
                flapBird();
            }
            break;
        case 'KeyP':
            if (gameState === 'PLAYING') {
                pauseGame();
            } else if (gameState === 'PAUSED') {
                resumeGame();
            }
            break;
        case 'KeyR':
            if (gameState === 'GAME_OVER') {
                startGame();
            }
            break;
        case 'Escape':
            if (gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAME_OVER') {
                showMenu();
            }
            break;
        case 'KeyM':
            toggleSound();
            break;
    }
}

function selectDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // Update button styles
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(difficulty + 'Btn').classList.add('selected');
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('soundStatus').textContent = soundEnabled ? '🔊' : '🔇';
}

// Game state management
function showMenu() {
    gameState = 'MENU';
    document.getElementById('menuScreen').classList.remove('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('pauseScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
}

function startGame() {
    gameState = 'PLAYING';
    score = 0;
    
    // Apply difficulty settings
    const settings = difficultySettings[currentDifficulty];
    gameSpeed = settings.gameSpeed;
    
    // Initialize bird
    bird = {
        x: 100,
        y: CANVAS_HEIGHT / 2,
        velocity: 0,
        gravity: 0.5,
        flapPower: -8
    };
    
    // Clear pipes
    pipes = [];
    
    // Update UI
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('difficulty').textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    
    // Show game screen
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('pauseScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
}

function pauseGame() {
    gameState = 'PAUSED';
    document.getElementById('pauseScreen').classList.remove('hidden');
}

function resumeGame() {
    gameState = 'PLAYING';
    document.getElementById('pauseScreen').classList.add('hidden');
}

function gameOver() {
    gameState = 'GAME_OVER';
    sounds.hit();
    
    // Check for new high score
    let isNewHighScore = false;
    if (score > highScores[currentDifficulty]) {
        highScores[currentDifficulty] = score;
        saveHighScores();
        updateHighScoreDisplay();
        isNewHighScore = true;
    }
    
    // Update game over screen
    document.getElementById('finalScore').textContent = 'Score: ' + score;
    document.getElementById('newHighScore').classList.toggle('hidden', !isNewHighScore);
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Game mechanics
function flapBird() {
    bird.velocity = bird.flapPower;
    sounds.flap();
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Check ground and ceiling collision
    if (bird.y + BIRD_SIZE > CANVAS_HEIGHT - GROUND_HEIGHT || bird.y < 0) {
        gameOver();
    }
}

function updatePipes() {
    const settings = difficultySettings[currentDifficulty];
    
    // Add new pipe
    if (pipes.length === 0 || pipes[pipes.length - 1].x < CANVAS_WIDTH - settings.pipeSpacing) {
        const gapY = Math.random() * (CANVAS_HEIGHT - GROUND_HEIGHT - settings.pipeGap - 100) + 50;
        pipes.push({
            x: CANVAS_WIDTH,
            gapY: gapY,
            gapHeight: settings.pipeGap,
            passed: false
        });
    }
    
    // Update pipe positions
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= gameSpeed;
        
        // Check if bird passed pipe
        if (!pipes[i].passed && pipes[i].x + PIPE_WIDTH < bird.x) {
            pipes[i].passed = true;
            score++;
            document.getElementById('score').textContent = 'Score: ' + score;
            sounds.score();
        }
        
        // Remove off-screen pipes
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
    }
}

function checkCollisions() {
    for (let pipe of pipes) {
        // Check collision with pipe
        if (bird.x + BIRD_SIZE > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
            if (bird.y < pipe.gapY || bird.y + BIRD_SIZE > pipe.gapY + pipe.gapHeight) {
                gameOver();
                return;
            }
        }
    }
}

// Rendering
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.8, '#B0E0E6');
    gradient.addColorStop(0.8, '#98FB98');
    gradient.addColorStop(1, '#32CD32');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw pipes
    ctx.fillStyle = '#228B22';
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = 2;
    
    for (let pipe of pipes) {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + pipe.gapHeight, PIPE_WIDTH, CANVAS_HEIGHT - pipe.gapY - pipe.gapHeight);
        ctx.strokeRect(pipe.x, pipe.gapY + pipe.gapHeight, PIPE_WIDTH, CANVAS_HEIGHT - pipe.gapY - pipe.gapHeight);
    }
    
    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.fillRect(bird.x, bird.y, BIRD_SIZE, BIRD_SIZE);
    ctx.strokeRect(bird.x, bird.y, BIRD_SIZE, BIRD_SIZE);
    
    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);
}

// Game loop
function gameLoop() {
    if (gameState === 'PLAYING') {
        updateBird();
        updatePipes();
        checkCollisions();
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game when page loads
window.addEventListener('load', init);
