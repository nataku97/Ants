angular.module('Ants').directive('antScreen', ['$interval', function($interval) {

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
		template: "<canvas id='antcanvscreen' />",


		link: function(scope, element, attrs) {
			scope.canvas = element.find('canvas')[0];
			scope.context = scope.canvas.getContext('2d');
			scope.canvas.width = 1280;
			scope.canvas.height = 720;

			scope.drawAnt = function(ant, t) {
				drawImage(scope.canvas, ant.x, ant.y, ant.dir, t.getAsset(ant.type));
			};

			scope.drawHill = function(hill, t) {
				drawImage(scope.canvas, hill.x, hill.y, 0.0, t.getAsset('h') );
			};

			scope.drawColonies = function() {
				
				teams = scope.worldCollections;

				//var ctx = scope.context;
				scope.context.clearRect(0, 0, scope.canvas.width, scope.canvas.height);
				
				//TODO double buffer
				//scope.context.drawImage(buffer, 0, 0);
				//buffctx.clearRect(0, 0, world.width, world.height);

				//draw hills first so they have lower z order.
				//for each team draw each hill. 
				for (i = 0; i < teams.length; i++) {
					for (k = 0; k < teams[i].hills.length; k++) {
						this.drawHill(teams[i].hills[k], teams[i]);
					}
				}

				//for each team draw each ant.
				for (i = 0; i < teams.length; i++) {
					for (k = 0; k < teams[i].ants.length; k++) {
						this.drawAnt(teams[i].ants[k], teams[i]);
					}
				}

			};

			scope.update = $interval(function() {
				scope.drawColonies();
			}, 32);
		}
	}
}]);