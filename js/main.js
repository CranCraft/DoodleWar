// Erstellt ein neues Fenster mit gegeben Parametern und weist es der Variabel Game zu
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', {
	preload : preload,
	create : create,
	update : update
});

//Hier werden die Bilder mit entsprechenden Variabeln geladen und wenn angegeben mit größen
function preload() {

	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star', 'assets/star.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	game.load.image('bullet', 'assets/bullet.png');
	game.load.image('box' , 'assets/box.png');

}

// Typlose Variabeln für die gesamte Laufzeit

// Begrezungslinien für Spieler (Linie1 = Links, Linie2 = Rechts)
var line1;
var line2;

// Beide Spieler (Spieler 1 = Links, Spieler 2 = Rechts)
var player1;
var player2;

// Für die Zuweisung des Inputs der Pfeiltasten für Spieler 2
var cursors;

// Schießen Variablen (bullets für die Kollisonsbrechnung, bulletTime = ???, fireButton für die auswahl des Schießenbuttons)
var bullets;
var bulletTime = 0;
var bulletTime2 = 0;
var fireButton;
var bulletVelocity1 = 500;
var bulletVelocity2 = 500;


//Spiel läuft = 0, Spiel beendet 1;
var gameOn = 0;

var box;

// Folgende Funktion wird zu beginn einmal ausgeführt und ersellt alle Objekte für ein Spiel inklusive Spieler, Leben usw.
function create() {


	// Fügt einen Hintergrund an der Position an der Stelle links oben ein (0,0), das Bild welches verwendet wird hat die Variabel sky
	game.add.sprite(0, 0, 'sky');

	// An dieser Stelle erzeugen wir die beiden Wände die beide Spieler separieren. Dazu wird die gesamte Spielbreite durch
	// 3 geteilt. Linie 1 wird an Stelle der (Spielbreite : 3) angelegt die linie 2 (Spielbreite : 3 * 2). Die Grafik heißt ground
	line1 = game.add.sprite(game.world.width / 3, 0, 'ground');
	line2 = game.add.sprite(2 * game.world.width / 3, 0, 'ground');
	
	// Für die beiden Linienobjekte wird die Pysic angestellt damit eine Kollisionsbrechenung stattfinden kann
	game.physics.enable(line1, Phaser.Physics.ARCADE);
	game.physics.enable(line2, Phaser.Physics.ARCADE);

	//Setzt die linien fest so das sie nicht mehr verschoben werden können
	game.physics.arcade.enable(line1);
	line1.body.immovable = true;

	game.physics.arcade.enable(line2);
	line2.body.immovable = true;


	// Startposition für die Spieler , und assets (Bilder für Bewegung...) gesetzt
	player1 = game.add.sprite(32, game.world.height - 150, 'dude');
	player2 = game.add.sprite(game.world.width - 64, game.world.height - 150, 'dude');

	//  Animationen für nach links, rechts gehen
	player1.animations.add('left', [0, 1, 2, 3], 10, true);
	player1.animations.add('right', [5, 6, 7, 8], 10, true);

	player2.animations.add('left', [0, 1, 2, 3], 10, true);
	player2.animations.add('right', [5, 6, 7, 8], 10, true);

	// Stellt die Phsic beider Spieler ein, z.B. für Kollisionsberechnung
	game.physics.arcade.enable(player1);
	game.physics.arcade.enable(player2);

	// Verhinder das Spieler aus dem Feld rausgehen können
	player1.body.collideWorldBounds = true;
	player2.body.collideWorldBounds = true;


	//  Steuerung des Spielers 2 mithilfe der Pfeiltasten
	cursors = game.input.keyboard.createCursorKeys();

	// Steuerung des Spielers 1 mithilfe WASD Tasten
	wupKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	sdownKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	aleftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	drightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

	// Schießebutton für Spieler 1 (leertaste)
	fireButton1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	// Schießebutton für Spieler 2 (leertaste)
	fireButton2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);


	// Die Kugel-Variablen für Spieler1
	bulletsPlayer1 = game.add.group();
	bulletsPlayer1.enableBody = true;
	bulletsPlayer1.physicsBodyType = Phaser.Physics.ARCADE;
	bulletsPlayer1.createMultiple(30, 'bullet');
	bulletsPlayer1.setAll('anchor.x', 0, 5);
	bulletsPlayer1.setAll('anchor.y', 1);
	bulletsPlayer1.setAll('outOfBoundsKill', true);
	bulletsPlayer1.setAll('checkWorldBounds', true);

	// Die Kugel-Variablen für Spieler2
	bulletsPlayer2 = game.add.group();
	bulletsPlayer2.enableBody = true;
	bulletsPlayer2.physicsBodyType = Phaser.Physics.ARCADE;
	bulletsPlayer2.createMultiple(30, 'bullet');
	bulletsPlayer2.setAll('anchor.x', 0, 5);
	bulletsPlayer2.setAll('anchor.y', 1);
	bulletsPlayer2.setAll('outOfBoundsKill', true);
	bulletsPlayer2.setAll('checkWorldBounds', true);



	//  Leben für Spieler 1 
	livesPlayer1 = game.add.group();

	//Setzt die Bilder für das Leben nebeneinander
	for (var i = 0; i < 3; i++) {
		var player1Lives = livesPlayer1.create(40 + (30 * i), 60, 'bullet');
		player1Lives.anchor.setTo(0.5, 0.5);
		player1Lives.angle = 90;
		player1Lives.alpha = 0.4;
	}

	// Leben für Spieler 2
	livesPlayer2 = game.add.group();

	//Setzt die Bilder für das Leben nebeneinander
	for (var i = 0; i < 3; i++) {
		var player2Lives = livesPlayer2.create(game.world.width - 100 + (30 * i), 60, 'bullet');
		player2Lives.anchor.setTo(0.5, 0.5);
		player2Lives.angle = 90;
		player2Lives.alpha = 0.4;
	}

	//  Text nach Sieg eines Spielers und Anleitung für Restart
	stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
		font : '84px Arial',
		fill : '#fff'
	});
	stateText.anchor.setTo(0.5, 0.5);
	stateText.visible = false;

}

// Hier ist alles drinne was durcgehend geprüft werden muss
function update() {
	
	// geschwindigkeit wird auf 0 gesetzt, damit sie nur bei klicken gehen
	player1.body.velocity.x = 0;
	player2.body.velocity.x = 0;
	player1.body.velocity.y = 0;
	player2.body.velocity.y = 0;
	
		if(gameOn==0){
            if (fireButton1.isDown) {
			fireBulletPlayer1();
		}
		
		if (fireButton2.isDown) {
			fireBulletPlayer2();
		}
        }
		
	//Kolliosion der Spieler mit den Linien
	if (game.physics.arcade.collide(player1, line1, null) && game.physics.arcade.collide(player2, line2, null)) {

	}
	if ((game.physics.arcade.collide(player2, line2, null) || game.physics.arcade.collide(player1, line1, null))) {

	} 
	
	if(gameOn == 0){
		//Player 1 controls
		if (wupKey.isDown) {
			//  Move to the left
			player1.body.velocity.y = -150;

			player1.animations.play('up');
		} else if (sdownKey.isDown) {
			//  Move to the right
			player1.body.velocity.y = 150;

			player1.animations.play('down');
		} else if (aleftKey.isDown) {
			//  Move to the right
			player1.body.velocity.x = -150;

			player1.animations.play('left');
		} else if (drightKey.isDown) {
			//  Move to the right
			player1.body.velocity.x = 150;
			player1.animations.play('right');
		} else {
			//  Stand still
			player1.animations.stop();

			player1.frame = 4;
		}
		
		//Hier werden die Bewegungen gesetzt sowie das Schießen
		if (cursors.up.isDown) {
			//  Move to the left
			player2.body.velocity.y = -150;

			player2.animations.play('up');
		} else if (cursors.down.isDown) {
			//  Move to the right
			player2.body.velocity.y = 150;

			player2.animations.play('down');
		} else if (cursors.left.isDown) {
			//  Move to the right
			player2.body.velocity.x = -150;

			player2.animations.play('left');
		} else if (cursors.right.isDown) {
			//  Move to the right
			player2.body.velocity.x = 150;

			player2.animations.play('right');
		} else {
			//  Stand still
			player2.animations.stop();

			player2.frame = 4;
		}

    }
    

	
	// Wenn Kugel Spieler trifft dann führe playerXgotHit aus
	game.physics.arcade.overlap(bulletsPlayer2, player1, player1gotHit, null, this);
	game.physics.arcade.overlap(bulletsPlayer1, player2, player2gotHit, null, this);
}

// Schießunktion für Spieler 1
function fireBulletPlayer1() {

	if (game.time.now > bulletTime) {
		bullet = bulletsPlayer1.getFirstExists(false);
		bullet.reset(player1.x + 70, player1.y + 40);
		bullet.body.velocity.x = 200;
		//Variable für die Geschwindigkeit in der geschossen werden kann
		bulletTime = game.time.now + bulletVelocity1;
	}
}

//Schieß-Funktion für Spieler 2
function fireBulletPlayer2() {

	if (game.time.now > bulletTime2) {
		bullet = bulletsPlayer2.getFirstExists(false);
		bullet.reset(player2.x - 70, player2.y + 40);
		bullet.body.velocity.x = -200;
		//Variable für die Geschwindigkeit in der geschossen werden kann
		bulletTime2 = game.time.now + bulletVelocity2; 
	}
}

//Verhalten wenn Spieler 1 von einer Kugel getroffen wird
function player1gotHit(player1) {

	bulletsPlayer2.destroy();

	live = livesPlayer1.getFirstAlive();

	if (live) {
		live.kill();
	}

	// When the player dies
	if (livesPlayer1.countLiving() < 1) {
		player1.kill();
		bulletsPlayer2.callAll('kill');

		stateText.text = "Spieler 2 Gewinnt \n Klick für Neustart";
		stateText.visible = true;
        gameOn = 1;

		//the "click to restart" handler
		game.input.onTap.addOnce(restart, this);
	}

}

//Verhalten wenn Spieler 2 von einer Kugel getroffen wird 
function player2gotHit(player2) {

	bulletsPlayer1.destroy();

	live = livesPlayer2.getFirstAlive();

	if (live) {
		live.kill();
	}

	// When the player dies
	if (livesPlayer2.countLiving() < 1) {
		player2.kill();
		bulletsPlayer1.callAll('kill');

		stateText.text = "Spieler 1 Gewinnt \n Klick für Neustart";
		stateText.visible = true;
        gameOn = 1;

		//the "click to restart" handler
		game.input.onTap.addOnce(restart, this);
	}

}

//Funktion um die Schießgeschwindigkeit zu erhöhen
function increaseBulletVelocity(Player1){
    bulletVelocity1 = 2*bulletVelocity1;
    game.time.events.add(Phaser.Timer.SECOND * 4, setBulletVelocityToStandard(Player1), this);
}

function increaseBulletVelocity(Player2){
    bulletVelocity2 = 2*bulletVelocity2;
    game.time.events.add(Phaser.Timer.SECOND * 4, setBulletVelocityToStandard(Player2), this);

}

function setBulletVelocityToStandard(Player1){
        bulletVelocity1 = 500;
}

function setBulletVelocityToStandard(Player2){
        bulletVelocity2 = 500;
}

//Wenn spiel neu gestartet wird
function restart() {

	//  A new level starts
	gameOn = 0;
	
	//resets the life count
	livesPlayer1.callAll('revive');
	livesPlayer2.callAll('revive');

	//revives the player
	player1.revive();
	player2.revive();
	//hides the text
	stateText.visible = false;

}

function powerUpGotHit() {
	
}
