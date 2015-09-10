angular.module('Ants', []);
/*
	This initialized the app data for ant simulation.
*/
angular.module('Ants').controller('AntsCtrl', [ 'Colony', 'Hill', 'Ant', 'locSupplier', 'canvasPen', 'universeMachine',
 function(Colony, Hill, Ant, locSupply, canvasPen, universalLogic) {
	this.world = document.getElementById("ViewPort");
	this.viewWidth = 1280;
	this.viewHeight = 720;

	this.teams = [ new Colony('Green', '#3CB371', locSupply.getHillSpawnPT(this.viewWidth, this.viewHeight)),
					 new Colony('Blue', '#4169E1', locSupply.getHillSpawnPT(this.viewWidth, this.viewHeight)),
				  	 new Colony('Red', '#FF6347', locSupply.getHillSpawnPT(this.viewWidth, this.viewHeight)),
				  	 new Colony('Ivory', '#FFFFF0', locSupply.getHillSpawnPT(this.viewWidth, this.viewHeight)),
				  	 new Colony('Tan', '#D2B48C', locSupply.getHillSpawnPT(this.viewWidth, this.viewHeight)),
					 new Colony('Gold', '#FFD700', locSupply.getHillSpawnPT(this.viewWidth, this.viewHeight)) ];
	
	this.count = function () { return this.teams.length; };
	this.init = function() { canvasPen.initBuffer(); };
	
	this.draw = function() { canvasPen.drawAnts(this.world, this.teams); };
	this.update = function() { universalLogic.update(this.teams); };
	this.step = function() { 
		this.draw();
		this.update();
	};
	this.play = function() {
		universalLogic.simulationPlay(this);
	}
}]);