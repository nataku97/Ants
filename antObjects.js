var AntsApp = angular.module('Ants', []);

AntsApp.service('antsSvcs', function() {
	var pt = {x: 0, y: 0};

	this.getPT = function (w, h) {
		pt.x = ((-w) + Math.floor(Math.random() * (w + w) ) );
		pt.y = ((-h) + Math.floor(Math.random() * (h + h) ) );

		return pt; 
	};

});


AntsApp.service('imgSupplier', function() {
	this.colorAntImage = function(img, cr) {
		return colorAntImage( new Image(img), cr);
	};

	this.prepTeamAssets = function(cr) {
		return ({ w: this.colorAntImage('ant_worker.png', cr), 
				 s: this.colorAntImage('ant_soldier.png', cr),
				 q: this.colorAntImage('ant_queen.png', cr),
				 e: null });
	};

});

AntsApp.service('canvasPen', function() {

	this.drawAnt = function(ant, team) {
		drawImage(world.getContext('2d'), ant.x, ant.y, team.color);
	};

	this.drawAnts = function() {
		for (i = 0; i < teams.length; i++) {
			for (k = 0; k < teams[i].ants.length; k++) {
				this.drawAnt(teams[i].ants[k], team[i] );
			}
		}
	};

});

/*
	This file defines object classes for ant simulation.
*/
AntsApp.factory(
	"Ant", function () {

		function Ant(t, hp, pt) {
			this.type = t;
			this.hitpoints = hp;
			
			if (t == 'e') {
				this.live = false;
			}
			else {
				this.live = true;
			}

			this.x = Math.floor(pt.x + ((-10) + Math.random() * (20)));
			this.y = Math.floor(pt.y + ((-10) + Math.random() * (20)));
		}

		Ant.prototype = {
			type: function() { return (this.type); },
			HP: function() { return (this.hitpoints); },
			x: function() { return (this.x); },
			y: function() { return (this.y); },
			damage: function(d) { 
				this.hitpoints = this.hitpoints - d;
									
				if (this.hitpoints < 1) {
						this.live = false;
				}	 
			},
			heal: function(h) {
				if (this.live) {
					this.hitpoints = this.hitpoints + h;
				}
			},
			move: function(nx, ny) {
				this.x = nx;
				this.y = ny;
			},
			hatch: function() {
				if (this.type == 'e') {
					var p = Math.random();

					if (p < 0.76) {
						this.type = 'w';
						this.hitpoints = 2;
					}
					else {
						this.type = 's';
						this.hitpoinrs = 3;
					}
				}
			}

		};

		return ( Ant );
	}
);

AntsApp.factory(
	"Hill", function () {

		function Hill(c, s, sx, sy) {
			this.colony = c;
			this.supply = s;
			this.x = sx;
			this.y = sy;
		}

		/*function Hill(c, s) {
			this.colony = c;
			this.supply = s;
			
			var quadX = 1;
			var quadY = 1;
			if (Math.random < 0.51) {
				quadX = -1;
			}
			if (Math.random < 0.51) {
				quadY = -1;
			}

			this.x = Math.random * 800 * quadX;
			this.y = Math.random * 600 * quadY;
		}*/

		Hill.prototype = {
			team: function() { return(this.colony); },
			supply: function() { return(this.supply); },
			x: function() { return(this.x); },
			y: function() { return(this.y); },
			useSupply: function(x) {this.supply = this.supply - x;},
			produceEgg: function(t) {
				if (this.supply%t.population > 0 ) {
					var xmod = Math.random * 10;
					var ymod = Math.random * 10;
					 if (Math.random > 0.5) {
					 	xmod = xmod*-1;
					 }
					 if (Math.random > 0.5) {
					 	ymod = ymod*-1;
					 }
					t.add(Ant('e', 1, (this.x + xmod), (this.y + ymod)));
				}
			}
		};

		return ( Hill );
	}
);

AntsApp.factory( 
	"Colony", ['Hill', 'Ant', 'imgSupplier', function(Hill, Ant, imgSup) {
		function Colony(n, cr, pt) {
			this.name = n;
			this.color = cr;
			this.hills = [new Hill(this.name, 5, pt.x, pt.y)];
			this.ants = [new Ant('q', 1, pt),
						 new Ant('s', 3, pt),
						 new Ant('w', 1, pt),
						 new Ant('w', 1, pt),
						 new Ant('w', 1, pt)];
			this.assets = imgSup.prepTeamAssets(this.color);
		}

		Colony.prototype = {
			name: function() { return(this.name); },
			color: function() { return(this.color); },
			hills: function() { return(this.hills); },
			hill: function(i) { return(this.hills[i]); },
			ants: function() { return(this.ants); },
			ant: function(i) { return(this.ants[i]); },
			getAsset: function(n) { if (n == 'e') { return (this.assets.e); }
									else if (n == 'w') { return (this.assets.w); }
									else if (n == 's') { return (this.assets.s); }
									else if (n == 'q') { return (this.assets.e); }
								  }
		};

		return( Colony );
	} 
]); 

/*
	This initialized the app data for ant simulation.
*/
AntsApp.controller('antsCtrl', [ 'Colony', 'Hill', 'Ant', 'antsSvcs', '$scope', function(Colony, Hill, Ant, antsSvcs, $scope) {
	$scope.teams = [ new Colony('Green', '#3CB371', antsSvcs.getPT(1280, 720)),
					 new Colony('Blue', '#4169E1', antsSvcs.getPT(1280, 720)),
				  	 new Colony('Red', '#FF6347', antsSvcs.getPT(1280, 720)), 
					 new Colony('Gold', '#FFD700', antsSvcs.getPT(1280, 720)) ];
	$scope.count = '4';
	$scope.viewWidth = 1280;
	$scope.viewHeight = 720;
	$scope.world;
}]);