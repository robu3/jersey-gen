var chromath = require("chromath");

// # HexColor
// Class for working with colors in hexadecimal format
function HexColor(r, g, b) {
	var rgb = [];
	if (typeof(r) === "object") {
		// assume it's an array
		rgb = r;
	} else {
		rgb.push(r);
		rgb.push(g);
		rgb.push(r);
	}

	// make sure input is an int
	this.r = rgb[0];
	this.g = rgb[1];
	this.b = rgb[2];
}

HexColor.prototype.updateRgb = function (rgb) {
	this.r = rgb[0];
	this.g = rgb[1];
	this.b = rgb[2];
};

HexColor.prototype.updateHsb = function (hsb) {
	var rgb = chromath.hsv2rgb(hsb[0], hsb[1], hsb[2]);
	rgb[0] = Math.round(rgb[0] * 255);
	rgb[1] = Math.round(rgb[1] * 255);
	rgb[2] = Math.round(rgb[2] * 255);
	console.log("rgb", rgb);
	this.updateRgb(rgb);
};

// ## pastelize
// Converts color to brightened pastel of the same hue
HexColor.prototype.pastelize = function () {
	var hsb = this.toHsbArray();
	hsb[1] = 0.5;
	hsb[2] = 1;

	this.updateHsb(hsb);

	return this;
};

// ## towards
// Moves this color towards the specified color (RGB)
HexColor.prototype.towards = function (rgb, t) {
	// check if HexColor instance; if so, get rgb array
	// else, assume rgb array
	if (rgb instanceof HexColor) {
		rgb = rgb.toRgbArray();
	}
	var updated = chromath.towards(chromath.rgb(this.toRgbArray()), chromath.rgb(rgb), t);
	this.updateRgb(updated.rgb());

	return this;
};

HexColor.prototype.setSaturation = function (saturation) {
	var hsb = this.toHsbArray(),
		rgb = chromath.hsv2rgb(hsb[0], saturation, hsb[2]);

	this.updateRgb(rgb);
};

HexColor.prototype.setBrightness = function (bright) {
	var hsb = this.toHsbArray(),
		rgb = chromath.hsv2rgb(hsb[0], hsb[1], bright);

	this.updateRgb(rgb);
};

HexColor.prototype.toHexColor = function () {
	var buffer = "#",
		temp;
	[this.r, this.g, this.b].forEach(function (b) {
		temp = b.toString(16);
		if (temp.length < 2) {
			temp = "0" + temp;
		}
		buffer += temp;
	});	

	return buffer;
};

HexColor.prototype.toRgbArray = function () {
	return [this.r, this.g, this.b];
};

HexColor.prototype.toHsbArray = function() {
	return chromath.rgb2hsv(this.r, this.g, this.b);
};

module.exports = HexColor;
