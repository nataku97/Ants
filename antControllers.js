angular.module('Ants', []);
/*
	This initialized the app data for ant simulation.
*/
angular.module('Ants').controller('AntsCtrl', [ 'Colony', 'Hill', 'Ant', 'locSupplier', 'universeMachine',
 function(Colony, Hill, Ant, locSupply, universalLogic) {
	this.teams = [ new Colony('Green', '#3CB371', locSupply.getHillSpawnPT()),
				  	 new Colony('Red', '#F86347', locSupply.getHillSpawnPT()),
				  	 new Colony('SkyBlue', '#87CEEB', locSupply.getHillSpawnPT()),
				  	 new Colony('Khaki','#F0E68C', locSupply.getHillSpawnPT()),
					 new Colony('LightSalmon', '#FFA07A', locSupply.getHillSpawnPT()),
				  	 new Colony('Ivory', '#FFFFF0', locSupply.getHillSpawnPT()),
					 new Colony('Gold', '#FFD700', locSupply.getHillSpawnPT()) ];
	
	this.count = function () { return this.teams.length; };

	this.pause = function() { return universalLogic.play; };

	this.togglePause = function () {
		universalLogic.togglePause();
	}

	this.play = function() {
		universalLogic.togglePause();

		if (!universalLogic.start) {
			universalLogic.start = true;
			setInterval(function() { universalLogic.update(this); }, 8);
		}
	}
}]);