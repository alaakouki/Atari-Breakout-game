let ball;
let bricks;
let paddle;
let destroyed;

let scoreText;
let score = 0;

let livesText;
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

function preload() {
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("brick", "assets/images/brick.png");
    this.load.image("destroyed", "assets/images/destroyed.png");
    this.load.image("paddle", "assets/images/paddle.png");
};

function create() {
    // We can add image objects by calling this.physics.add.image, passing in the x and y position and the key we created inside the preload function.
    
    // To center it horizontally, we can get the middle of the screen with cameras.main.centerX. To display it at the bottom, we get the height of the canvas – 50px. We also call setImmovable to tell Phaser this body can’t be moved by collisions.
    paddle = this.physics.add.image(this.cameras.main.centerX, this.game.config.height -50,"paddle")
    .setImmovable();

    ball = this.physics.add.image(this.cameras.main.centerX, this.game.config.height -100, "ball")
    // We want the ball to collide with the world boundaries and bounce back from them, this is what we achieve with the function chaining.
    .setCollideWorldBounds(true)
    .setBounce(1);


    // For Brick(s), we are using a staticGroup. The key references our asset’s name. frameQuantity is used for the number of times the image will be displayed and gridAlign is used for alignments:
    // width is used for the number of items displayed on one line. Since we want to display 20 items on two lines, we can use a 10×2 grid.
    // cellWidth and cellHeight is for each individual item. The image itself is 50x50px and we want 5px paddings on each side so we can go with a value of 60. To center it horizontally, we get centerX – (half of the width of the group). Lastly I also positioned it 100px from the top.
    bricks = this.physics.add.staticGroup({
        key: "brick",
        frameQuantity: 20,
        gridAlign: {
            width: 10, cellWidth: 60, cellHeight: 60, x: this.cameras.main.centerX -277.5, y: 100
        }
    });
    // We can create texts using the this.add.text method. It takes four parameters: the x and y position, the text itself, and an optional styles object. 
    scoreText = this.add.text(20, 20, "Score: 0", textStyle);
    livesText = this.add.text(this.game.config.width -20, 20, `Lives: ${lives}`, textStyle)
    // The anchor point for the texts is on the top left corner by default, so to correctly position “lives”, we need to move the anchor to the top right corner. This is what setOrigin is supposed to do.
    .setOrigin(1,0);

    gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Game Over", textStyle)
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({backgroundColor: "#111", fill:"#e74c3c"})
    .setVisible(false);

    wonTheGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "You won the game!", textStyle)
    // we setorigin(0.5) to move the anchor position to the middle.
    .setOrigin(0.5)
    .setPadding(10)
    // overrides for the default styles with setStyle
    .setStyle({backgroundColor: "#111", fill:"#27ae60"})
    // As we don’t want them to be displayed at the start of the game, we can hide them with the setVisible method.
    .setVisible(false);

    startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Start game", textStyle)
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({backgroundColor: "#111"})
    // To make it act like a button we can register inputs by calling setInteractive. Adding useHandCursor will show a pointer when hovered instead of the default cursor.
    .setInteractive({useHandCursor: true})

    // We can also define different event listeners on it using the on method. For hover, we can set a different fill color.
    // On click — which is handled by pointerdown — we call the startGame function.
    .on("pointerdown", () => startGame.cal(this))
    .on("pointerover", () => startButton.setStyle({fill: "#f39c12"}))
    // pointerout will be the blur event where we set back the style. 
    .on("pointerout", () => startButton.setStyle({fill: "#FFF"}));

}