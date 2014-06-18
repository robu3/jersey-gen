var chromath = require("chromath");

// # HexColor
// Class for working with colors in hexadecimal format.
// Colors are internally stored in RGB format, but can be manipulated in HSB space as well.
function HexColor(r, g, b) {
	var rgb = [];
	// check for different constructor calls

	// HexColor([255, 0, 0])
	if (Array.isArray(r)) {
		rgb = r;
	} 

	// HexColor({ r: 255, g: 0, b: 0 })
	else if (typeof(r) === "object") {
		rgb.push(r.r);
		rgb.push(r.g);
		rgb.push(r.b);
	}

	// HexColor(255, 0, 0)
	else {
		rgb.push(r);
		rgb.push(g);
		rgb.push(b);
	}

	// make sure input is an int
	this.r = rgb[0];
	this.g = rgb[1];
	this.b = rgb[2];
}

// "static" functions
// --------------------
// ## rgbToHsb
// Converts RGB to HSB space
// Reference: http://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma
HexColor.rgbToHsb = function (r, g, b) {
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		chroma = max - min,
		B = max,	
		S = max === 0 ? 0 : chroma / max,
		H,
		hue;

	if (chroma === 0) {
		hue = 0;
	}
	else if (max === r) {
		hue = ((g - b) / chroma) % 6;
	}
	else if (max == g) {
		hue = ((b - r) / chroma) + 2;
	}
	else if (max == b) {
		hue = ((r - g) / chroma) + 4;
	}

	H = hue * 60;
	return [H, S, B];
};



// ## updateRgb
// Updates RGB values.
//
// - rgb: array of RGB values [255, 0, 0]
HexColor.prototype.updateRgb = function (rgb) {
	this.r = rgb[0];
	this.g = rgb[1];
	this.b = rgb[2];
};

// ## updateHsb
// Updates HSB values, converting back into RGB when finished.
//
// - hsb: array of HSB values [1, .5, .4]
HexColor.prototype.updateHsb = function (hsb) {
	var rgb = chromath.hsv2rgb(hsb[0], hsb[1], hsb[2]);
	rgb[0] = Math.round(rgb[0] * 255);
	rgb[1] = Math.round(rgb[1] * 255);
	rgb[2] = Math.round(rgb[2] * 255);

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

// ## toHexCode
// Returns the value of this color in hexadecimal format, e.g.,
// #FF0000
HexColor.prototype.toHexCode = function () {
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

// ## toRgbArray
// Returns the value of this color in RGB format, e.g.,
// [255, 0, 0]
HexColor.prototype.toRgbArray = function () {
	return [this.r, this.g, this.b];
};

HexColor.prototype.toHsbArray = function() {
	return chromath.rgb2hsv(this.r, this.g, this.b);
};

// ## equalsRgb
// True if RGB properties match the RGB array
HexColor.prototype.equalsRgb = function (rgb) {
	return (
		this.r === rgb[0] &&
		this.g === rgb[1] &&
		this.b === rgb[2]
	);
};

// ## buildFromHsb
// Factory for creating new colors from HSB
HexColor.buildFromHsb = function (hsb) {
	var c = new HexColor(0, 0, 0);
	c.updateHsb(hsb);

	return c;
};

// ## buildFromHexCode
HexColor.buildFromHexCode = function (hexCode) {
	// chop off # if present
	if (hexCode[0] === "#") {
		hexCode = hexCode.substring(1, hexCode.length);
	}

	var i,
		bytes = [];

	for (i = 0; i < 3; i++) {
		bytes.push(parseInt("0x" + hexCode.substr(i * 2, 2)));
	}

	return new HexColor(bytes);
};

module.exports = HexColor;
