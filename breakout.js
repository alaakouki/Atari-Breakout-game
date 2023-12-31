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

    paddle = this.physics.add.image(this.cameras.main.centerX, this.game.config.height - 50, "paddle")
        .setImmovable();

    ball = this.physics.add.image(this.cameras.main.centerX, this.game.config.height - 100, "ball")

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
            width: 10, cellWidth: 60, cellHeight: 60, x: this.cameras.main.centerX - 277.5, y: 100
        }
    });

    // We can create texts using the this.add.text method. It takes four parameters: the x and y position, the text itself, and an optional styles object. 

    scoreText = this.add.text(20, 20, "Score: 0", textStyle);
    livesText = this.add.text(this.game.config.width - 20, 20, `Lives: ${lives}`, textStyle)

        // The anchor point for the texts is on the top left corner by default, so to correctly position “lives”, we need to move the anchor to the top right corner. This is what setOrigin is supposed to do.

        .setOrigin(1, 0);

    gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Game Over", textStyle)
        .setOrigin(0.5)
        .setPadding(10)
        .setStyle({ backgroundColor: "#111", fill: "#e74c3c" })
        .setVisible(false);

    wonTheGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "You won the game!", textStyle)

        // we setorigin(0.5) to move the anchor position to the middle.

        .setOrigin(0.5)
        .setPadding(10)

        // overrides for the default styles with setStyle

        .setStyle({ backgroundColor: "#111", fill: "#27ae60" })

        // As we don’t want them to be displayed at the start of the game, we can hide them with the setVisible method.

        .setVisible(false);

    startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Start game", textStyle)
        .setOrigin(0.5)
        .setPadding(10)
        .setStyle({ backgroundColor: "#111" })

        // To make it act like a button we can register inputs by calling setInteractive. Adding useHandCursor will show a pointer when hovered instead of the default cursor.

        .setInteractive({ useHandCursor: true })

        // We can also define different event listeners on it using the on method. For hover, we can set a different fill color.
        // On click — which is handled by pointerdown — we call the startGame function.

        .on("pointerdown", () => startGame.cal(this))
        .on("pointerover", () => startButton.setStyle({ fill: "#f39c12" }))

        // pointerout will be the blur event where we set back the style. 

        .on("pointerout", () => startButton.setStyle({ fill: "#FFF" }));

    // add.collider expects 5 params:
    // The two objects which between the collision happens
    // A callback function that will run whenever the two objects collide
    // A process callback, which will fire when the two objects intersect. It is similar to the callback function, but it must return a boolean. We can leave it null.
    // The context of the callback function

    this.physics.add.collider(ball, bricks, brickHit, null, this);
    this.physics.add.collider(ball, paddle, paddleHit, null, this);

}


function brickHit(ball, brick) {
    brick.setTexture("destroyed");

    score += 5;
    scoreText.setText(`Score: ${score}`);

    // To create the animation, we can use tween.add
    // targets to determine which game object will be animated
    // By setting scaleX & scaleY to 0, we can shrink it down.
    // and by using angle: 180 it will rotate it by 180 degree in the meantime.
    // we use delay to prevent the animation starting as soon as the collision happens.

    this.tweens.add({
        targets: brick,
        ease: "Power1",
        scaleX: 0,
        scaleY: 0,
        angle: 180,
        duration: 500,
        delay: 250,
        onComplete: () => {
            brick.destroy();

            if (bricks.countActive() === 0) {
                ball.destroy();
                wonTheGameText.setVisible(true);
            }
        }
    });

};

function paddleHit(ball, paddle) {
    let diff = 0;

    if (ball.x < paddle.x) {
        diff = paddle.x - ball.x;
        ball.setVelocityX(-20 * diff);
        rotation = "left";
    } else if (ball.x > paddle.x) {
        diff = ball.x - paddle.x;
        ball.setVelocityX(20 * diff);
        rotation = "right";
    } else {
        ball.setVelocityX(2 + Math.random() * 10);
    }
};

function update() {
    if (rotation) {
        ball.rotation = rotation === "left" ? ball.rotation - .05 : ball.rotation + .05;
    }

    if (ball.y > paddle.y) {
        lives--;

        if (lives > 0) {
            livesText.setText(`Lives: ${lives}`);

            ball.setPosition(this.cameras.main.centerX, this.game.config.height - 100)
            .setVelocity(300, -150);
        } else {
            ball.destroy();

            gameOverText.setVisible(true);
        }
    }
};

function startGame() {

    // By calling destroy(), we removing the start button
    
    startButton.destroy();
    
    // To shoot out the ball we can apply a force using setVelocity. It takes in two forces, one on the x and one on the y axis
    
    ball.setVelocity(-300, -150);
    
    // We set the rotation to left which we will later use to rotate the ball as it flies.
    
    rotation = "left";

    // to move the paddle we can add an event listener on the whole scene with input.on. Inside the callback, we set the paddle’s x position to the mouse x position. To avoid moving it outside of the screen, we force pointer.x to be between a min and a max value. This is done using the Math.Clamp method.
    
    this.input.on(
        "pointermove", pointer => {
            paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, this.game.config.width - paddle.width / 2);
        });
}

startGame();