function colorAntImage(img, cr) {
		
	color = hexToRgb(cr);

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');

	var imgW = img.width;
	var imgH = img.height;
	var scaleW = imgW/6;
	var scaleH = imgH/6;
	canvas.width = scaleW;
	canvas.height = scaleH;

	ctx.drawImage(img, 0, 0, scaleW, scaleH);

	var imgPixels = ctx.getImageData(0, 0, scaleW, scaleH);

	for (y = 0; y < imgPixels.height; y++) {
		for (x = 0; x < imgPixels.width; x++) {
			var i = (y*4) * imgPixels.width + x * 4;
			var r = imgPixels.data[i];
			var g = imgPixels.data[i+1];
			var b = imgPixels.data[i+2];
			var a = imgPixels.data[i+3];

			if (r == g && g == b && r >= 32) {
				scale = r/255;

				r = (color.r * scale);
				g = (color.g * scale);
				b = (color.b * scale);

				imgPixels.data[i] = r;
				imgPixels.data[i+1] = g;
				imgPixels.data[i+2] = b;
			}
		}
	}

	ctx.putImageData(imgPixels, 0, 0);

	//alert("done: " + cr);

	return canvas;
}

function colorHillImage(img, cr) {
		
	color = hexToRgb(cr);

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');

	var imgW = img.width;
	var imgH = img.height;
	canvas.width = imgW;
	canvas.height = imgH;

	ctx.drawImage(img, 0, 0, imgW, imgH);

	var imgPixels = ctx.getImageData(0, 0, imgW, imgH);

	for (y = 0; y < imgPixels.height; y++) {
		for (x = 0; x < imgPixels.width; x++) {
			var i = (y*4) * imgPixels.width + x * 4;
			var r = imgPixels.data[i];
			var g = imgPixels.data[i+1];
			var b = imgPixels.data[i+2];
			var a = imgPixels.data[i+3];

			if (r == g && g == b && r >= 32) {
				scale = r/255;

				r = (color.r * scale);
				g = (color.g * scale);
				b = (color.b * scale);

				imgPixels.data[i] = r;
				imgPixels.data[i+1] = g;
				imgPixels.data[i+2] = b;
			}
		}
	}

	ctx.putImageData(imgPixels, 0, 0);

	return canvas;
}

function drawImage(canv, x, y, r, i) {
	ctx = canv.getContext('2d');

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(r);
	ctx.drawImage(i, -i.width/2, -i.height/2, i.width, i.height);
	ctx.restore();

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