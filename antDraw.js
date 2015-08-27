function colorAntImage(i, cr) {
	
	var canvas = document.getElementById('worldCan');
	var width = i.width;
	var w2 = width/2;
	var height = i.height;

	var context = canvas.getContext('2d');
	context.drawImage(i, 0, 0, width, height);


	setTimeout( function() {} , 10000 );
	var imageData = context.getImageData(0, 0, width, height);

	for (y = 0; y < height; y++) {
		inpos = y *width * 4;
		outpos = inpos + w2 *4;
		for (x = 0; x < w2; x++) {
			r = imageData.data[inpos++];
			g = imageData.data[inpos++];
			b = imageData.data[inpos++];
			a = imageData.data[inpos++];

			if (r == g && g == b && b > 69) {
				scale = b /255;

				nc = hexToRgb(cr);
				nc.r = nc.r * scale;
				nc.g = nc.g * scale;
				nc.b = nc.b * scale;

				imageData.data[outpos++] = nc.r;
				imageData.data[outpos++] = nc.g;
				imageData.data[outpos++] = nc.b;
				imageData.data[outpos++] = a;

			}
		}
	}

	var img = new Image(i.name); //document.createElement(i.name);
	img.src = imageData;

	return img;
}

function drawImage(ctx, x, y, i) {
	ctx.drawImage(i, 10, 10);
}


//copied from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
//too good to pass up.
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}