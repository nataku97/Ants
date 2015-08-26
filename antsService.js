AntsApp.factory('antsSvcs', function() {

	return function (w, h) {
		var x = w * Math.random() * Math.floor(Math.random() * (w+1));
		var y = h * Math.random() * Math.floor(Math.random() * (h+1));

		return [x, y]; 
	}

});