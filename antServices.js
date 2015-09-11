angular.module('Ants').service('randomSupplier', function() {
	this.getRandomExclude = function(min, max) {
		return (min + Math.floor(Math.random() * (max - min)) );
	};

	this.getRandomInclude = function (min, max) {
		return (min + Math.floor(Math.random() * ((max -min) + 1)));
	};
} )

angular.module('Ants').service('locSupplier', ['randomSupplier', function(randSupply) {
	var pt = {x: 0, y: 0};

	this.getEdges = function() {
		return { left: 0, right: 1280, top: 720, bottom: 0 };
	};

	this.getRandomDir = function() {
		return (Math.random() * (2 * Math.PI) );
	};

	this.getHillSpawnPT = function (w, h) {
		pt.x = randSupply.getRandomInclude(50, w-50);
		pt.y = randSupply.getRandomInclude(50, h-50);

		return pt; 
	};

	this.getAntSpawn = function (hill) {
		var area = 30;
		var spawn = {x: randSupply.getRandomInclude(hill.x - area, hill.x + area), 
					y: randSupply.getRandomInclude(hill.y - area, hill.y + area),
					r: this.getRandomDir()};
		return spawn;
	};

}]);


angular.module('Ants').service('imgSupplier', function() {
	this.prepTeamAssets = function(t) {

		var team = t;
		var color = team.color;

		hillImg = new Image(70,50);
		hillImg.crossOrigin = "anonymous"
		hillImg.onload = function () {
			team.setAsset('h', prepHillImage(hillImg, color) );
		}
		hillImg.src = "ant_hill.png";

		workerImg = new Image(100,100);
		workerImg.crossOrigin = "anonymous";
		workerImg.onload = function () {
			team.setAsset('w', prepAntImage(workerImg, color) );
		}
		workerImg.src = "ant_worker.png";
		

		soldierImg = new Image(125,100);
		soldierImg.crossOrigin = "anonymous";
		soldierImg.onload = function () {
			team.setAsset('s', prepAntImage(soldierImg, color) );
		}
		soldierImg.src = "ant_soldier.png";
		

		queenImg = new Image(200, 200);
		queenImg.crossOrigin = "anonymous";
		queenImg.onload = function () {
			team.setAsset('q', prepAntImage(queenImg, color) );
		}
		queenImg.src = "ant_queen.png";

		return  ({ h: hillImg, 
				w: workerImg, 
				s: soldierImg,
				q: queenImg,
				e: null });
	};

});

angular.module('Ants').service('canvasPen', function() {
	var buffer = document.createElement("canvas");
	var buffctx = buffer.getContext('2d');
	
	this.initBuffer = function() {
		buffer.width = 1280;
		buffer.height = 720;
	}

	this.drawAnt = function(world, ant, t) {
		drawImage(world, ant.x, ant.y, ant.dir, t.getAsset(ant.type));
	};

	this.drawHill = function(world, hill, t) {
		drawImage(world, hill.x, hill.y, 0.0, t.getAsset('h') );
	};

	this.drawAnts = function(world, teams) {
		
		var ctx = world.getContext('2d');
		ctx.clearRect(0, 0, world.width, world.height);
		ctx.drawImage(buffer, 0, 0);
		buffctx.clearRect(0, 0, world.width, world.height);

		//draw hills first so they have lower z order.
		//for each team draw each hill. 
		for (i = 0; i < teams.length; i++) {
			for (k = 0; k < teams[i].hills.length; k++) {
				this.drawHill(buffer, teams[i].hills[k], teams[i] );
			}
		}

		//for each team draw each ant.
		for (i = 0; i < teams.length; i++) {
			for (k = 0; k < teams[i].ants.length; k++) {
				this.drawAnt(buffer, teams[i].ants[k], teams[i] );
			}
		}

	};

});

angular.module('Ants').service('antIndependantIntelligence', ['randomSupplier', function(randSupply) {
	this.mode = ['wonder'];
	this.direction = ['forward', 'left', 'right', 'back'];

	this.randomizeMode = function() {
		p = randSupply.getRandomExclude(0, 100);
	}

	this.getMode = function() { 
		return this.mode[0]; 
	};

	this.getDirection =function() {

		var p = randSupply.getRandomExclude(0,100)

		if (p < 17) {
			return this.direction[1];
		}
		else if (p > 16 && p < 33) {
			return this.direction[2];
		}
		else if (p > 22 && p < 98) {
			return this.direction[0];
		}
		else {
			return this.direction[3];
		}

	};

}])

angular.module('Ants').service('universeMachine', function() {

	this.update = function(teams) {
		for (var i = 0; i < teams.length; i++) {
			teams[i].update();
		}
	};

	this.simulationPlay = function(c) {
		c.init();
		setInterval(function() {c.step();} , 16);
	};
});