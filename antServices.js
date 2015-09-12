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

	this.getHillSpawnPT = function () {
		eds = this.getEdges();
		pt.x = randSupply.getRandomInclude(50, eds.right-50);
		pt.y = randSupply.getRandomInclude(50, eds.top-50);

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
	this.play = false;

	this.togglePause = function() {
		this.play = !this.play;
	};

	this.update = function(c) {
		if (this.play) {
			for (var i = 0; i < teams.length; i++) {
				c.teams[i].update();
			}
		}
	};
});