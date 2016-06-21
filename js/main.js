// Erstellt ein neues Fenster mit gegeben Parametern und weist es der Variabel Game zu
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', {
	preload : preload,
	create : create,
	update : update,
	render : render
});

// Hier werden die Bilder mit entsprechenden Variabeln geladen und wenn
// angegeben mit größen
function preload() {

	//Bilder
	game.load.image('sky', 'assets/background.png');
	game.load.image('lines', 'assets/platform.png');
	game.load.image('star', 'assets/star.png');
	game.load.spritesheet('dude', 'assets/dude1.png', 30, 40);
	game.load.spritesheet('dude2', 'assets/dude2.png', 30, 40);
	game.load.spritesheet('walk1', 'assets/dude1.png', 32, 48);
	game.load.spritesheet('walk2', 'assets/dude2.png', 32, 48);
	game.load.image('bullet1', 'assets/bullet1.png');
	game.load.image('bullet2', 'assets/bullet2.png');
	game.load.image('dropbox', 'assets/box.png');
	game.load.image('heart', 'assets/herz.png');
	game.load.image('wall1', 'assets/mauer.png');
	game.load.image('wall2', 'assets/mauer2.png');
	game.load.image('eins', 'assets/1.png');
	game.load.image('zwei', 'assets/2.png');
	game.load.image('drei', 'assets/3.png');
	game.load.image('vier', 'assets/4.png');
	game.load.image('fünf', 'assets/5.png');
	game.load.image('sechs', 'assets/6.png');
	game.load.image('sieben', 'assets/7.png');
	game.load.image('acht', 'assets/8.png');
	game.load.image('neun', 'assets/9.png');
	game.load.image('zehn', 'assets/10.png');
	game.load.image('null', 'assets/9.png');
	game.load.image('blackPixel', 'assets/onePixel.png');
	game.load.image('wallx', 'assets/x.png');

	//Sounds
	game.load.audio('shotPlayerOne', 'assets/SoundEffects/Blaster-Imperial.wav');
	game.load.audio('shotPlayerTwo', 'assets/SoundEffects/Blaster-Droideka.wav');
}

// Typlose Variabeln für die gesamte Laufzeit

// Begrezungslinien für Spieler (Linie1 = Links, Linie2 = Rechts)
var line1;
var line2;

// Unsichtbare Mauer oben für die Lebensanzeige und das graue Feld dahinter
var invisWall;
var invisField;

// Beide Spieler (Spieler 1 = Links, Spieler 2 = Rechts)
var player1;
var player2;

// HitBox der Spieler
var hitbox1;

// Für die Zuweisung des Inputs der Pfeiltasten für Spieler 2
var cursors;

// Schießen Variablen (bullets für die Kollisonsbrechnung, bulletTime = wie oft
// die Kästen runterfallen,
// fireButton für die auswahl des Schießenbuttons)
var bullets;
var bulletTime = 0;
var bulletTime2 = 0;
var fireButton;
var fireButtonCheckPlayer1 = false;
var fireButtonCheckPlayer2 = false;
var bulletVelocity1 = 500;
var bulletVelocity2 = 500;

// Spiel läuft = 0, Spiel beendet 1;
var gameOn = 0;

// powerUps
var boxes;
var boxesTime = 1000;
var boxesVelocity = 2500;

// Walls
var walls;
var wallsVelocity = 0;
var wallLive;
var dropWallCheckPlayer1 = false;
var dropWallCheckPlayer2 = false;

// Wall Speicher der einzelnen Spieler
var wallMemory1 = 0;
var wallMemory2 = 0;

// Array für die Zahlen der Walls
var wallDisplayArray = new Array();

// Benachrichtungen zu den Spielern was passiert, z.B. PowerUps
var popUpText1 = 0;
var popUpText2 = 0;

// Folgende Funktion wird zu beginn einmal ausgeführt und ersellt alle Objekte
// für ein Spiel inklusive Spieler, Leben usw.
function create() {
	// Fügt einen Hintergrund an der Position an der Stelle links oben ein
	// (0,0), das Bild welches verwendet wird hat die Variabel sky
	game.add.sprite(0, 0, 'sky');

	// An dieser Stelle erzeugen wir die beiden Wände die beide Spieler
	// separieren. Dazu wird die gesamte Spielbreite durch
	// 3 geteilt. Linie 1 wird an Stelle der (Spielbreite : 3) angelegt die
	// linie 2 (Spielbreite : 3 * 2). Die Grafik heißt ground
	line1 = game.add.sprite(game.world.width / 3, 0, 'lines');
	line2 = game.add.sprite(2 * game.world.width / 3, 0, 'lines');
	line1.alpha = 0;
	line2.alpha = 0;

	invisWall = game.add.group();
	invisWall.physicsBodyType = Phaser.Physics.ARCADE;
	invisWall.enableBody = true;
	invisWall = invisWall.create(0, 0, null);
	invisWall.body.setSize(game.world.width, 1, 0, 100);
	invisWall.body.immovable = true;

	invisField = game.add.group();
	invisField = game.add.sprite(0, 0, 'blackPixel');
	invisField.scale.setTo(800, 100);
	invisField.alpha = 0.2;

	// Für die beiden Linienobjekte wird die Pysic angestellt damit eine
	// Kollisionsbrechenung stattfinden kann
	game.physics.enable(line1, Phaser.Physics.ARCADE);
	game.physics.enable(line2, Phaser.Physics.ARCADE);

	// Setzt die linien fest so das sie nicht mehr verschoben werden können
	game.physics.arcade.enable(line1);
	line1.body.immovable = true;

	game.physics.arcade.enable(line2);
	line2.body.immovable = true;

	// Startposition für die Spieler , und assets (Bilder für Bewegung...)
	// gesetzt
	player1 = game.add.group();
	player1 = game.add.sprite(32, game.world.height - 150, 'dude');
	player2 = game.add.sprite(game.world.width - 64, game.world.height - 150, 'dude2');

	// Animationen für nach links, rechts gehen
	player1.animations.add('walk1', [0, 1, 2], 3, true);
	//player1.animations.add('right', [ 5, 6, 7, 8 ], 10, true);

	player2.animations.add('walk2', [0, 1, 2], 3, true);
	//player2.animations.add('right', [ 5, 6, 7, 8 ], 10, true);

	/*
	* player1.animations.add('left', [ 0, 1, 2, 3 ], 10, true);
	* player1.animations.add('right', [ 5, 6, 7, 8 ], 10, true);
	*
	* player2.animations.add('left', [ 0, 1, 2, 3 ], 10, true);
	* player2.animations.add('right', [ 5, 6, 7, 8 ], 10, true);
	*/

	// Stellt die Phsic beider Spieler ein, z.B. für Kollisionsberechnung
	game.physics.arcade.enable(player1);
	game.physics.arcade.enable(player2);

	// Verhinder das Spieler aus dem Feld rausgehen können
	player1.body.collideWorldBounds = true;
	player2.body.collideWorldBounds = true;

	// Spieler eins HitBox
	hitboxes1 = game.add.group();
	hitboxes1.enableBody = true;
	player1.addChild(hitboxes1);
	hitbox1 = hitboxes1.create(0, 0, null);
	hitbox1.body.setSize(player1.width, player1.height, player1.width, 0);

	// Steuerung des Spielers 2 mithilfe der Pfeiltasten
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

	// Schießebutton für Spieler 1 (leertaste)
	dropWall1 = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	// Schießebutton für Spieler 2 (leertaste)
	dropWall2 = game.input.keyboard.addKey(Phaser.Keyboard.L);

	// Die Kugel-Variablen für Spieler1
	bulletsPlayer1 = game.add.group();
	bulletsPlayer1.enableBody = true;
	bulletsPlayer1.physicsBodyType = Phaser.Physics.ARCADE;
	bulletsPlayer1.createMultiple(30, 'bullet1');
	bulletsPlayer1.setAll('anchor.x', 0, 5);
	bulletsPlayer1.setAll('anchor.y', 1);
	bulletsPlayer1.setAll('outOfBoundsKill', true);
	bulletsPlayer1.setAll('checkWorldBounds', true);

	// Die Kugel-Variablen für Spieler2
	bulletsPlayer2 = game.add.group();
	bulletsPlayer2.enableBody = true;
	bulletsPlayer2.physicsBodyType = Phaser.Physics.ARCADE;
	bulletsPlayer2.createMultiple(30, 'bullet2');
	bulletsPlayer2.setAll('anchor.x', 0, 5);
	bulletsPlayer2.setAll('anchor.y', 1);
	bulletsPlayer2.setAll('outOfBoundsKill', true);
	bulletsPlayer2.setAll('checkWorldBounds', true);

	// Power Up Box
	boxes = game.add.group();
	boxes.enableBody = true;
	boxes.physicsBodyType = Phaser.Physics.ARCADE;
	boxes.createMultiple(30, 'dropbox');
	boxes.setAll('anchor.x', 0, 5);
	boxes.setAll('anchor.y', 1);
	boxes.setAll('outOfBoundKill', true);
	boxes.setAll('checkWorldBounds', true);

	// Power Up Walls
	walls = game.add.physicsGroup(Phaser.Physics.ARCADE);
	walls.createMultiple(20, 'wall1');
	walls.setAll('outOfBoundKill', true);
	walls.setAll('checkWorldBounds', true);
	walls.setAll('type', 2);
	walls.setAll('enableBody', true);
	walls.setAll('body.immovable', true);

	// Leben für Spieler 1
	livesPlayer1 = game.add.group();

	// Setzt die Bilder für das Leben nebeneinander
	for (var i = 0; i < 3; i++) {
		var player1Lives = livesPlayer1.create(18 + (30 * i), 26, 'heart');
		player1Lives.anchor.setTo(0.5, 0.5);
	}

	// Leben für Spieler 2
	livesPlayer2 = game.add.group();

	// Setzt die Bilder für das Leben nebeneinander
	for (var i = 0; i < 3; i++) {

		var player2Lives = livesPlayer2.create(game.world.width - 78 + (30 * i), 26, 'heart');
		player2Lives.anchor.setTo(0.5, 0.5);
	}

	//Wall Icons
	var wallDisplayLeft = game.add.sprite(7, 50, 'wall1');
	var wallDisplayXLeft = game.add.sprite(32, 53, 'wallx');
	wallDisplayLeft.visible = true;
	wallDisplayXLeft.visible = true;
	
	var wallDisplayRight = game.add.sprite(game.width - 22, 50, 'wall1');
	var wallDisplayXRight = game.add.sprite(game.width - 60, 53, 'wallx');
	wallDisplayRight.visible = true;
	wallDisplayXRight.visible = true;
	

	//Anzeige der Mauern
	for (var i = 0; i < 22; i++) {
		wallDisplayArray[i] = 0;
	}

	wallDisplayArray[0] = game.add.sprite(66, 53, 'null');
	wallDisplayArray[1] = game.add.sprite(66, 53, 'eins');
	wallDisplayArray[2] = game.add.sprite(66, 53, 'zwei');
	wallDisplayArray[3] = game.add.sprite(66, 53, 'drei');
	wallDisplayArray[4] = game.add.sprite(66, 53, 'vier');
	wallDisplayArray[5] = game.add.sprite(66, 53, 'fünf');
	wallDisplayArray[6] = game.add.sprite(66, 53, 'sechs');
	wallDisplayArray[7] = game.add.sprite(66, 53, 'sieben');
	wallDisplayArray[8] = game.add.sprite(66, 53, 'acht');
	wallDisplayArray[9] = game.add.sprite(66, 53, 'neun');
	wallDisplayArray[10] = game.add.sprite(66, 53, 'zehn');

	wallDisplayArray[11] = game.add.sprite(game.width - 94, 53, 'null');
	wallDisplayArray[12] = game.add.sprite(game.width - 94, 53, 'eins');
	wallDisplayArray[13] = game.add.sprite(game.width - 94, 53, 'zwei');
	wallDisplayArray[14] = game.add.sprite(game.width - 94, 53, 'drei');
	wallDisplayArray[15] = game.add.sprite(game.width - 94, 53, 'vier');
	wallDisplayArray[16] = game.add.sprite(game.width - 94, 53, 'fünf');
	wallDisplayArray[17] = game.add.sprite(game.width - 94, 53, 'sechs');
	wallDisplayArray[18] = game.add.sprite(game.width - 94, 53, 'sieben');
	wallDisplayArray[19] = game.add.sprite(game.width - 94, 53, 'acht');
	wallDisplayArray[20] = game.add.sprite(game.width - 94, 53, 'neun');
	wallDisplayArray[21] = game.add.sprite(game.width - 94, 53, 'zehn');

	for (var i = 0; i < 22; i++) {
		wallDisplayArray[i].visible = false;
	}
	wallDisplayArray[0].visible = true;
	wallDisplayArray[11].visible = true;


	// Text nach Sieg eines Spielers und Anleitung für Restart
	stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
		font : '84px Arial',
		fill : '#fff'
	});
	stateText.anchor.setTo(0.5, 0.5);
	stateText.visible = false;

	// Text der Benachrichtigungen für die Spieler
	style = {
		font : "15px Arial",
		fill : "black"
	};
	powerUpText1 = this.game.add.text(game.width / 3 - 155, 32, "", style);
	powerUpText2 = this.game.add.text(2 * game.width / 3 + 15, 32, "", style);

	//Sounds
	shotPlayerOne = game.add.audio('shotPlayerOne');
	shotPlayerTwo = game.add.audio('shotPlayerTwo');

}

// Hier ist alles drinne was durchgehend geprüft werden muss
function update() {

	// geschwindigkeit wird auf 0 gesetzt, damit sie nur bei klicken gehen
	player1.body.velocity.x = 0;
	player2.body.velocity.x = 0;
	player1.body.velocity.y = 0;
	player2.body.velocity.y = 0;

	if (gameOn == 0) {
		if (fireButton1.isDown && !fireButtonCheckPlayer1) {
			fireButtonCheckPlayer1 = true;
			fireBulletPlayer1();
		}

		if (!fireButton1.isDown && fireButtonCheckPlayer1) {
			fireButtonCheckPlayer1 = false;
		}

		if (fireButton2.isDown && !fireButtonCheckPlayer2) {
			fireButtonCheckPlayer2 = true;
			fireBulletPlayer2();
		}

		if (!fireButton2.isDown && fireButtonCheckPlayer2) {
			fireButtonCheckPlayer2 = false;
		}

		if (dropWall1.isDown && !dropWallCheckPlayer1) {
			dropWallCheckPlayer1 = true;
			dropWall(player1);
		}

		if (!dropWall1.isDown && dropWallCheckPlayer1) {
			dropWallCheckPlayer1 = false;
		}

		if (dropWall2.isDown && !dropWallCheckPlayer2) {
			dropWallCheckPlayer2 = true;
			dropWall(player2);
		}

		if (!dropWall2.isDown && dropWallCheckPlayer2) {
			dropWallCheckPlayer2 = false;
		}
	}

	// Kolliosion der Spieler mit den Linien
	if (game.physics.arcade.collide(player1, line1, null) && game.physics.arcade.collide(player2, line2, null) && game.physics.arcade.collide(player1, invisWall, null) && game.physics.arcade.collide(player2, invisWall, null) && game.physics.arcade.collide(player1, walls, null) && game.physics.arcade.collide(player2, walls, null)) {

	}
	if ((game.physics.arcade.collide(player2, line2, null) || game.physics.arcade.collide(player1, line1, null) || game.physics.arcade.collide(player2, invisWall, null) || game.physics.arcade.collide(player1, invisWall, null) || game.physics.arcade.collide(player1, walls, null) || game.physics.arcade.collide(player2, walls, null))) {

	}

	if (gameOn == 0) {
		// Player 1 controls
		if (wupKey.isDown) {
			// Move to the left
			player1.body.velocity.y = -150;

		} else if (sdownKey.isDown) {
			// Move to the right
			player1.body.velocity.y = 150;

		} else if (aleftKey.isDown) {
			// Move to the right
			player1.body.velocity.x = -150;

			player1.animations.play('walk1');
		} else if (drightKey.isDown) {
			// Move to the right
			player1.body.velocity.x = 150;
			player1.animations.play('walk1');
		} else {
			// Stand still
			player1.animations.stop();

			player1.frame = 4;
		}

		// Hier werden die Bewegungen gesetzt sowie das Schießen
		if (cursors.up.isDown) {
			// Move to the left
			player2.body.velocity.y = -150;

		} else if (cursors.down.isDown) {
			// Move to the right
			player2.body.velocity.y = 150;

		} else if (cursors.left.isDown) {
			// Move to the right
			player2.body.velocity.x = -150;

			player2.animations.play('walk1');
		} else if (cursors.right.isDown) {
			// Move to the right
			player2.body.velocity.x = 150;

			player2.animations.play('walk2');
		} else {
			// Stand still
			player2.animations.stop();

			player2.frame = 4;
		}

	}

	// abwerfen der Boxes während das Spiel läuft
	if (gameOn == 0) {
		dropBox();
	}

	// Wenn Kugel Spieler trifft dann führe playerXgotHit aus
	game.physics.arcade.overlap(bulletsPlayer2, player1, player1gotHit, null, this);
	game.physics.arcade.overlap(bulletsPlayer1, player2, player2gotHit, null, this);

	// Wenn Kugel PowerUps trifft führe boxGotHit aus
	game.physics.arcade.overlap(bulletsPlayer1, boxes, boxGotHit, null, this);
	game.physics.arcade.overlap(bulletsPlayer2, boxes, boxGotHit, null, this);

	// Wenn Kugel Mauer trifft
	game.physics.arcade.overlap(bulletsPlayer1, walls, wallGotHit, null, this);
	game.physics.arcade.overlap(bulletsPlayer2, walls, wallGotHit, null, this);

}

// Schießunktion für Spieler 1
function fireBulletPlayer1() {

	if (game.time.now > bulletTime) {
		bullet = bulletsPlayer1.getFirstExists(false);
		bullet.reset(player1.x + 70, player1.y + 30);
		bullet.body.velocity.x = 200;
		// Variable für die Geschwindigkeit in der geschossen werden kann
		bulletTime = game.time.now + bulletVelocity1;
		shotPlayerOne.play();
	}
}

// Schieß-Funktion für Spieler 2
function fireBulletPlayer2() {

	if (game.time.now > bulletTime2) {
		bullet = bulletsPlayer2.getFirstExists(false);
		bullet.reset(player2.x - 70, player2.y + 30);
		bullet.body.velocity.x = -200;
		// Variable für die Geschwindigkeit in der geschossen werden kann
		bulletTime2 = game.time.now + bulletVelocity2;
		shotPlayerTwo.play();
	}
}

// lässt die Box regelmäßig runterfallen, gleich wie Schiesfunktion
function dropBox() {
	if (game.time.now > boxesTime) {
		box = boxes.getFirstExists(false);
		box.reset(1.5 * game.world.width / 3 - 6, 0);
		box.body.velocity.y = 250;

		// Variable für die Geschwindigkeit in der die Box herunterfällt
		var randomNumber = game.rnd.integerInRange(2, 6);
		boxesTime = game.time.now + randomNumber * boxesVelocity;

	}
}

// lässt die Mauer schwächer werden, hält nur drei Schuss aus
function wallGotHit(bullet, wall) {
	if (wall.type == 2) {
		wall.type = 1;
		wall = game.add.sprite('wall2');
	} else if (wall.type == 1) {
		wall.kill();

	}

	bullet.kill();
}

// PowerUp-Treff-Funktion
function boxGotHit(bullet, box) {

	// Wenn die Kugel von Spieler ein
	if (bullet.key == 'bullet1') {

		var randomNumber = game.rnd.integerInRange(0, 2);
		switch (randomNumber) {
		case 0:
			increaseBulletVelocity(player1);
			break;
		case 1:
			decreaseBulletVelocity(player1);
			break;
		case 2:
			getOneWall(player1);
			break;
		}
	} else {
		var randomNumber = game.rnd.integerInRange(0, 2);
		switch (randomNumber) {
		case 0:
			increaseBulletVelocity(player2);
			break;
		case 1:
			decreaseBulletVelocity(player2);
			break;
		case 2:
			getOneWall(player2);
			break;
		}
	}

	// Entfernt die Kugel die die Box getroffen hat
	bullet.kill();

	// Entfernt die Box die getroffen wurde
	box.kill();
}

// Verhalten wenn Spieler 1 von einer Kugel getroffen wird
function player1gotHit(player, bullet) {

	// Entfernt die Kugel die den Spieler 1 getroffen hat
	bullet.kill();

	// Anzahl der aktuellen Leben
	live = livesPlayer1.getFirstAlive();

	// Wenn Leben vorhanden ein Leben entfernen
	if (live) {
		live.kill();
	}

	// Wenn keine Leben mehr => Spieler verliert
	if (livesPlayer1.countLiving() < 1) {

		// Entfernt die Spielfigur des Spielers 1
		player1.kill();

		// Entfernt alle Kugeln von Spielern 1
		bulletsPlayer1.destroy();

		// Setzt den Text visible
		stateText.text = "Spieler 2 Gewinnt \n Klick für Neustart";
		stateText.visible = true;
		gameOn = 1;

		// Wenn auf das Spiel geklickt wird startet das Spiel neu
		game.input.onTap.addOnce(restart, this);
	}

}

// Verhalten wenn Spieler 2 von einer Kugel getroffen wird
function player2gotHit(player, bullet) {

	bullet.kill();

	live = livesPlayer2.getFirstAlive();

	if (live) {
		live.kill();
	}

	// When the player dies
	if (livesPlayer2.countLiving() < 1) {
		player2.kill();
		bulletsPlayer2.destroy();

		stateText.text = "Spieler 1 Gewinnt \n Klick für Neustart";
		stateText.visible = true;
		gameOn = 1;

		// the "click to restart" handler
		game.input.onTap.addOnce(restart, this);
	}

}

// Powerups:

// der Mauerspeicher jeders Spielers wird erhöht
function getOneWall(player) {
	if (player == player1) {
		wallDisplayArray[wallMemory1].visible = false;
		wallMemory1 = wallMemory1 + 1;
		wallDisplayArray[wallMemory1].visible = true;

		powerUpText1.setText("Du hast nun eine Mauer mehr");
		game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText1Back, this);
	} else {
		wallDisplayArray[wallMemory2 + 11].visible = false;
		wallMemory2 = wallMemory2 + 1;
		wallDisplayArray[wallMemory2 + 11].visible = true;

		powerUpText2.setText("Du hast nun eine Mauer mehr");
		game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText2Back, this);
	}
}

// Funktion um die Schießgeschwindigkeit zu verändern
function increaseBulletVelocity(Player) {

	if (Player == player1) {
		bulletVelocity1 = bulletVelocity1 / 2;
		powerUpText1.setText("Du kannst nun schneller schießen");
		game.time.events.add(Phaser.Timer.SECOND * 4, setBulletVelocityToStandard1, this);
		game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText1Back, this);

	} else {
		bulletVelocity2 = bulletVelocity2 / 2;
		powerUpText2.setText("Du kannst nun schneller schießen");
		game.time.events.add(Phaser.Timer.SECOND * 4, setBulletVelocityToStandard2, this);
		game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText2Back, this);

	}
}

function setBulletVelocityToStandard1() {
	bulletVelocity1 = 500;
}

function setBulletVelocityToStandard2() {
	bulletVelocity2 = 500;

}

// Funktion um die Schießgeschwindigkeit des Gegeners zu verlangsamen
function decreaseBulletVelocity(Player) {
	if (Player == player1) {
		bulletVelocity2 = bulletVelocity2 * 2;
		powerUpText1.setText("Dein Gegner schießt nun langsamer");
		game.time.events.add(Phaser.Timer.SECOND * 4, setBulletVelocityToStandard2, this);
		// game.time.events.add(Phaser.Timer.SECOND * 4, powerUpText2 = "",
		// this);

	} else {
		bulletVelocity1 = bulletVelocity1 * 2;
		powerUpText2.setText("Dein Gegner schießt nun langsamer");
		game.time.events.add(Phaser.Timer.SECOND * 4, setBulletVelocityToStandard1, this);
		// game.time.events.add(Phaser.Timer.SECOND * 4, popUpText2 = "",
		// this);

	}
}

function checkOverlap() {

	var check = false;

	for (var i = 0,
	    len = walls.children.length; i < len; i++) {
		var boundsA = walls.children[i].getBounds();
		console.log("Wall Position" + boundsA);
		console.log("WorldPosition" + hitbox1.worldPosition);
		console.log("WorldPosition" + hitbox1);
		check = game.physics.arcade.collide(hitbox1, boundsA);
		console.log(check);
		if (check == true) {
			console.log("Fehler, hier steht schon eine Mauer	");
			return false;
		}
	}
	return true;
}

// Funktion um die Schießgeschwindigkeit des Gegeners zu verlangsamen
function decreaseBulletVelocity(Player) {
	if (Player == player1) {
		bulletVelocity2 = bulletVelocity2 * 2;
		powerUpText1.setText("Dein Gegner schießt nun langsamer");
		game.time.events.add(Phaser.Timer.SECOND * 4, setBulletVelocityToStandard2, this);
		game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText1Back, this);

	} else {
		bulletVelocity1 = bulletVelocity1 * 2;
		powerUpText2.setText("Dein Gegner schießt nun langsamer");
		game.time.events.add(Phaser.Timer.SECOND * 4, setBulletVelocityToStandard1, this);
		game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText2Back, this);

	}
}

function setPowerUpText1Back() {
	powerUpText1.setText("");
}

function setPowerUpText2Back() {
	powerUpText2.setText("");
}

function dropWall(player) {
	//var check = checkOverlap(); TODO
	if (player == player1) {
		if (wallMemory1 > 0) {
			wall = walls.getFirstExists(false);
			wall.revive();
			wall.x = player.position.x + 40;
			wall.y = player.position.y;
			//console.log(wall.x, wall.y, player.position.x, player.position.y);

			wallDisplayArray[wallMemory1].visible = false;
			wallMemory1 = wallMemory1 - 1;
			wallDisplayArray[wallMemory1].visible = true;

			powerUpText1.setText("Du hast nun eine Mauer weniger");
			game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText1Back, this);
		} else {
			powerUpText1.setText("Du hast keine Mauern mehr zum setzten");
			game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText1Back, this);
		}
	} else {
		if (wallMemory2 > 0) {
			wall = walls.getFirstExists(false);
			wall.revive();
			wall.x = player.position.x - 40;
			wall.y = player.position.y;
			//console.log(wall.x, wall.y, player.position.x, player.position.y);

			wallDisplayArray[wallMemory2 + 11].visible = false;
			wallMemory2 = wallMemory2 - 1;
			wallDisplayArray[wallMemory2 + 11].visible = true;

			powerUpText2.setText("Du hast nun eine Mauer weniger");
			game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText2Back, this);
		} else {
			powerUpText2.setText("Du hast keine Mauern mehr zum setzten");
			game.time.events.add(Phaser.Timer.SECOND * 4, setPowerUpText2Back, this);
		}
	}
}

// Wenn spiel neu gestartet wird
function restart() {

	// A new level starts
	gameOn = 0;

	// resets the life count
	livesPlayer1.callAll('revive');
	livesPlayer2.callAll('revive');

	// revives the player
	player1.revive();
	player2.revive();
	// hides the text
	stateText.visible = false;

}


function render() {
	//game.debug.body(hitbox1);
	//game.debug.body(player1);
	// game.debug.body(invisWall);
}