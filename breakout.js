let ball;
let brick;
let paddle;

let scoreText;
let score = 0;

letlivesText;
let lives = 3;

let startButton;

let gameOverText;
let wonTheGameText;

let rotation;

// for text style:
const textStyle = {
    font: "bold 18px Arial",
    fill: "#FFF"
};

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#222",
    physics: {
        default: "arcade",
        arcade: {
            // debug: true - Set debug: true if you want collision boxes to be drawn
            checkCollision: {
                up: true,
                down: false,
                left: true,
                right: true
            }
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);