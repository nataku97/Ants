/*
	This initialized the app data for ant simulation.
*/
angular.module('Ants', []).controller('antsCtrl',  function($scope) {
	$scope.teams = [ new Colony('Green', '#3CB371'),
					 new Colony('Blue', '#4169E1'),
					 new Colony('Red', '#4169E1'), 
					 new Colony('Gold', '#FFD700')];
});