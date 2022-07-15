
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
    

}

var game = new Phaser.Game(config);
var platforms;
// loading image
function preload()
{
   
    this.load.image('sky', 'assets/sky.png')
    this.load.image('star', 'assets/star.png')
    this.load.image('platform', 'assets/platform.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}
// creating animae some physic
function create()
{
   // x, y coordinate 
   //load image
    this.add.image(400, 300, 'sky')
    //add the platform going to be static it not moving
    platforms = this.physics.add.staticGroup();
    // use platform to place the image
    //set the first image to the bottom
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    // space out image
    platforms.create(600, 400, 'platform');
    platforms.create(50, 250, 'platform');
    platforms.create(750, 220, 'platform');

    // player add phsycic add sprite
    player = this.physics.add.sprite(100, 250, 'dude');
    
    // set the player to bouce
    player.setBounce(0.2);
    // if this set to false it will keep bouncing
    player.setCollideWorldBounds(true);
    
    // create the framework for the player image
    this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
});
// set the player on the platform object
this.physics.add.collider(player, platforms);

//create stars
stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 10, y: 0, stepX: 70}
});

stars.children.iterate(function(child){
    child.setBounce(Phaser.Math.FloatBetween(0.1,0.8));
});

// for stars to bouce to the platform

this.physics.add.collider(stars, platforms);

// // check if the player overlap with the stars

this.physics.add.overlap(player, stars, collectStar, null, this);
//set score
var score = 0;
var scoreText;

scoreText = this.add.text(16,16, 'score: 0', {fontsize: '32px', fill: '#000'});

function collectStar (player, stars)
{   //disable stars
    stars.disableBody(true, true);
    // loop through scores
    score+= 10;
    //set scores text
    scoreText.setText('Score:' + score);

    if (stars.Countactive(true) === 0)
    {
        stars.children.iterate(function(child){
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400,800) : Phaser.math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200) ,20)
    }


}

// // add bombs objects
bombs = this.physics.add.group();

//add bomb 
this.physics.add.collider(bombs, platforms);

this.physics.add.collider(player, bombs, hitBomb, null, this);
// hitBomb function 
function hitBomb (player, bombs)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
}

// for keyboard to play
function update()
{
    cursors = this.input.keyboard.createCursorKeys();

    if(cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);

    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }

    else
    {
    player.setVelocityX(0);
    player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
    player.setVelocityY(-330);
    }
}


