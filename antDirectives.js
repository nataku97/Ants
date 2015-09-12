angular.module('Ants').directive('antScreen', ['$interval', '$window', 'locSupplier', function($interval, $window, locSupply) {

	/*This factory function should return an object with the 
	different options to tell $compile how the directive should
	behave when matched */
	return {
		
		//this is a new html element, match only element names
		restrict: 'E',

		scope: {
			worldCollections: '=world'
		},

		//its basically a canvas...
		template: "<canvas id='antcanvscreen'/>",


		link: function(scope, element, attrs) {
			scope.canvas = element.find('canvas')[0];
			scope.context = scope.canvas.getContext('2d');
			scope.canvas.width = $window.innerWidth;
			scope.canvas.height = $window.innerHeight - 70;
			var bounds = locSupply.getEdges();
			var viewOffSetX = (bounds.east/2 - scope.canvas.width/2);
			var viewOffSetY = (bounds.south/2 - scope.canvas.height/2);
			var inputOffSetX = 0;
			var inputOffSetY = 0;
			var mouseScrollZone = 140;
			var scrollRate = 10;
			var scroll = false;
			var mx = 0;
			var my = 0;

			//Event listeners
			scrollMouse = function() {
				
				if (mx < mouseScrollZone && (viewOffSetX + inputOffSetX - scrollRate) > 0) {
					inputOffSetX -= scrollRate;
				}
				else if (mx > (scope.canvas.width - mouseScrollZone) && (viewOffSetX + inputOffSetX - scrollRate) < bounds.east) {
					inputOffSetX += scrollRate;
				}
				if (my < mouseScrollZone && (viewOffSetY + inputOffSetY - scrollRate) > 0) {
					inputOffSetY -= scrollRate;
				}
				else if (my > (scope.canvas.height - mouseScrollZone) && (viewOffSetY + inputOffSetY - scrollRate) <bounds.south ) {
					inputOffSetY += scrollRate;
				}
			}

			element.on('mousemove', function(event) {
				mx = event.pageX;
				my = event.pageY;
			});

			element.on('mouseenter', function(event) {
				scroll = true;
			})

			element.on('mouseleave', function(event) {
				scroll = false;
			})

			//Draw helpers
			drawAnt = function(ant, t) {
				drawImage(scope.canvas, ant.x - (viewOffSetX + inputOffSetX),
					 ant.y - (viewOffSetY + inputOffSetY),
					 ant.dir,
					 t.getAsset(ant.type));
			};

			drawHill = function(hill, t) {
				drawImage(scope.canvas, hill.x - (viewOffSetX + inputOffSetX),
					 hill.y - (viewOffSetY + inputOffSetY),
					 0.0,
					 t.getAsset('h'));
			};

			cullObjects = function() {
				teams = scope.worldCollections;

				hills = [];
				ants = [];

				minX = viewOffSetX + inputOffSetX;
				maxX = minX + scope.canvas.width;
				minY = viewOffSetY + inputOffSetY;
				maxY = minY + scope.canvas.height;

				//cull hills
				for (i = 0; i < teams.length; i++) {
					for (k = 0; k < teams[i].hills.length; k++) {
						if ((teams[i].hills[k].x > minX && teams[i].hills[k].x < maxX) &&
							(teams[i].hills[k].y > minY && teams[i].hills[k].y < maxY )) {
							hills.push({h: teams[i].hills[k], t: teams[i]});
						}
					}
				}

				//cull ants
				for (i = 0; i < teams.length; i++) {
					for (k = 0; k < teams[i].ants.length; k++) {
						if ((teams[i].ants[k].x > minX && teams[i].ants[k].x < maxX) &&
							(teams[i].ants[k].y > minY && teams[i].ants[k].y < maxY )) {
							ants.push({a: teams[i].ants[k], t: teams[i]});
						}
					}
				}


				return {onH: hills, onA: ants };
			};

			drawColonies = function() {
				
				onscreen = this.cullObjects();

				//update mouse first
				if(scroll) {
					scrollMouse();
				}

				//var ctx = scope.context;
				scope.context.clearRect(0, 0, scope.canvas.width, scope.canvas.height);
				scope.context.font = "18px serif";
				scope.context.fillText( "x: " + (viewOffSetX+inputOffSetX) +
										", y: " + (viewOffSetY+inputOffSetY), 0, 20);
				scope.context.fillText( "mx: " + (mx) +
										", my: " + (my), 0, 40);
				
				//TODO double buffer
				//scope.context.drawImage(buffer, 0, 0);
				//buffctx.clearRect(0, 0, world.width, world.height);

				//draw hills first so they have lower z order.
				//for each team draw each hill. 
				for (i = 0; i < onscreen.onH.length; i++) {
					this.drawHill(onscreen.onH[i].h, onscreen.onH[i].t);
				}

				//for each team draw each ant.
				for (i = 0; i < onscreen.onA.length; i++) {
					this.drawAnt(onscreen.onA[i].a, onscreen.onA[i].t);
				}

			};

			scope.update = $interval(function() {
				drawColonies();
			}, 32);
		}
	}
}]);