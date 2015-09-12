/*
	This file defines object classes for ant simulation.
*/
angular.module('Ants').factory(
	"Ant", ['locSupplier', 'antIndependantIntelligence', function (locSupply, aii) {

		function Ant(t, hp, pt) {
			this.type = t;
			this.hitpoints = hp;

			var start = locSupply.getAntSpawn(pt);

			this.x = start.x;
			this.y = start.y;
			this.dir = start.r;

			//todo remove hard coding of width hieght prob remove too?
			this.live = true;
			if (t == 'e') {
				this.live = false;
			}
		}

		Ant.prototype = {
			getType: function() { 
				if (this.type == 'w') {return 'worker';}
				else if (this.type == 's') {return 'soldier'; }
				else if (this.type == 'q') {return 'queen'; }
 				else if (this.type == 'e') {return 'egg';} },
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
			moveForward: function() {
				this.x -= 5*(Math.cos(this.dir)/8);
				this.y -= 5*(Math.sin(this.dir)/8);
			},
			moveBackward: function() {
				this.x += Math.cos(this.dir)/2;
				this.y += Math.cos(this.dir)/2;
			},
			changeDirection: function(delta) {
				if ( (this.dir + delta) < 0) {
					this.dir = (2*Math.PI) - delta;
				}
				else if ((this.dir + delta) > (2*Math.PI) ) {
					this.dir = 0 + delta;
				}
				else {
					this.dir += delta;
				}
			},
			turnLeft: function() {
				this.changeDirection(-0.025);
			},
			turnRight: function() {
				this.changeDirection(0.025);
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
			},
			update: function() {
				//TODO hatch, change start, other advanced things >_<
				var mode = aii.getMode();

				if (mode == 'wonder') {
					var d = aii.getDirection();

					if (d == 'forward') {
						edges = locSupply.getEdges();
						if ( (this.x < edges.west || this.x > edges.east) ||
						 	(this.y < edges.north || this.y > edges.south) ) {
								this.changeDirection(Math.PI);	
						}
						this.moveForward();
					}
					else if (d == 'back') {
						this.moveBackward();
					}
					else if (d == 'left') {
						this.turnLeft();
					}
					else if (d == 'right') {
						this.turnRight();
					}
				}
				else
				{
					;
				}
			}

		};

		return ( Ant );
	}
]);

angular.module('Ants').factory(
	"Hill", function () {

		function Hill(c, s, sx, sy) {
			this.colony = c;
			this.supply = s;
			this.x = sx;
			this.y = sy;
		}

		Hill.prototype = {
			team: function() { return(this.colony); },
			supply: function() { return(this.supply); },
			x: function() { return(this.x); },
			y: function() { return(this.y); },
			useSupply: function(x) {this.supply = this.supply - x;},
			produceEgg: function(t) {
				if (this.supply%t.population > 0 ) {
					pt = {x: this.x, y: this.y};
					t.add( Ant('e', 1, pt) );
				}
			}
		};

		return ( Hill );
	}
);

angular.module('Ants').factory( 
	"Colony", ['Hill', 'Ant', 'imgSupplier', function(Hill, Ant, imgSup) {
		function Colony(n, cr, pt) {
			this.name = n;
			this.color = cr;
			this.hills = [new Hill(this.name, 5, pt.x, pt.y)];
			this.ants = [new Ant('q', 1, pt),
						 new Ant('s', 3, pt),
						 new Ant('s', 3, pt),
						 new Ant('s', 3, pt),
						 new Ant('s', 3, pt),
						 new Ant('w', 1, pt),
						 new Ant('w', 1, pt),
						 new Ant('w', 1, pt),
						 new Ant('w', 1, pt),
						 new Ant('w', 1, pt)];
			this.assets = imgSup.prepTeamAssets(this);
		}

		Colony.prototype = {
			name: function() { return(this.name); },
			color: function() { return(this.color); },
			hills: function() { return(this.hills); },
			hill: function(i) { return(this.hills[i]); },
			ants: function() { return(this.ants); },
			ant: function(i) { return(this.ants[i]); },
			setAsset: function(n, a) { 
				if (n == 'e') { this.assets.e = a; }
				else if (n == 'w') { this.assets.w = a; }
				else if (n == 's') { this.assets.s = a; }
				else if (n == 'q') { this.assets.q = a; }
				else if (n == 'h') { this.assets.h = a; }
			},	
			getAsset: function(n) { 
				if (n == 'e') { return (this.assets.e); }
				else if (n == 'w') { return (this.assets.w); }
				else if (n == 's') { return (this.assets.s); }
				else if (n == 'q') { return (this.assets.q); }
				else if (n == 'h') { return (this.assets.h); }
			},
			setAssetSRC: function(n, a) { 
				if (n == 'e') { this.assets.e.src = a; }
				else if (n == 'w') { this.assets.w.src = a; }
				else if (n == 's') { this.assets.s.src = a; }
				else if (n == 'q') { this.assets.q.src = a; }
			},
			getAssetSRC: function(n) { 
				if (n == 'e') { return (this.assets.e.src); }
				else if (n == 'w') { return (this.assets.w.src); }
				else if (n == 's') { return (this.assets.s.src); }
				else if (n == 'q') { return (this.assets.q.src); }
			},

			update: function() {
				for (i = 0; i < this.ants.length; i++) {
					this.ants[i].update();
				} 
			}
		};

		return( Colony );
	} 
]); 