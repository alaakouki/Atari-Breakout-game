# Atari-Breakout-game
<!-- we are going to make use of a game framework written in Javascript called Phaser.


Apart from the individual game objects, we can also create a constant for the text styles. Lastly, the config object will be passed to Phaser.Game to initialize the game. This configuration object takes in the following properties:

type will be used to tell Phaser which renderer to use. Using Phaser.AUTO will choose WebGL if available. Otherwise, it will fall back to canvas.
The width and height properties alongside with backgroundColor are used to set the corresponding styles for the canvas element.
The physics object is used to tell which physics system to use. It can be either arcade, impact or matter. Based on the type of game we are creating, we’re going to use arcade. Here you can also pass another object with the name of the physics system to further configure it. By setting debug to true, you can enable collision boxes to be drawn for the sprites.
checkCollision will be responsible for checking collisions on the world boundaries. We want to check for every side except for the bottom. This means the ball can fall through the screen to the bottom but not through the top or left and right side.


Each scene is controlled by a different set of functions

preload is used for loading in assets such as images or sounds
create is used for adding game objects to the scene
update is called indefinitely and is used for animations or checks for conditions that can happen in any frame, such as the ball falling down
 -->
