var config = require("../ini/config.js"),
	wordParser = require("./word-parser.js"),
	HexColor = require("./HexColor.js"),
	palette = {};

// ## hexColorFromWords
// returns a hex color from the specified array of words; will make array if a string
//
// - words: array of words, or string
// - options
//  - lerpT: time value for lerp
//  - sort: if words is a string, `true` will cause the array to be sorted
//  - delegate: formatter function to be called on each color; needs to return the color
palette.hexColorFromWords = function (words, options) {
	options = options || {};
	options.delegate = options.delegate || function (hexColor) { return hexColor; };
	options.lerpT = options.lerpT || .5;
	options.sort = options.hasOwnProperty("sort") ? options.sort : false;

	if (typeof words === "string") {
		words = wordParser.getWords(words, options.sort);
	}

	var color = options.delegate(palette.hexColorFromString(words[0])),
		i;

	// TODO: pull the lerp T out into an option?
	for (i = 1; i < words.length; i++) {
		color.towards(options.delegate(palette.hexColorFromString(words[i])), options.lerpT);
	}

	return color;
};

// ## hexColorFromString
// returns a hex color from the specified string
palette.hexColorFromString = function (str) {
	var buffer = new Buffer(str, "utf8"),
		rgb = [],
		skip,
		i;

	// if less than 3 bytes,
	// we need to pad the buffer
	if (buffer.length < 3) {
		var temp = new Buffer([0x00, 0x00, 0x00]);
		buffer.copy(temp);
		buffer = temp;
	}


	skip = parseInt(buffer.length / 3);

	// add each byte
	for (i = 0; i < buffer.length; i += skip) {
		rgb.push(buffer[i]);
	}

	hexColor = new HexColor(rgb);

	return hexColor;
};

// ## hueFromString
palette.hueFromString = function (str, lerpT) {
	lerpT = lerpT || .5;
	// printable characters start from decimal 32 (hex 20) in UTF-8
	// end at 126 (hex 7e)
	var min = 32,
		max = 176,
		buffer = new Buffer(str),
		i,
		hue,
		h;

	hue = buffer[0] - 32;

	for (i = 1; i < buffer.length; i++) {
		hue = palette.lerp1d(hue, hue + (buffer[i] - 32), lerpT);
	}

	// wrap around if necessary
	hue = hue % 360;

	return hue;
};

// ## hueFromWords
//
// - words: array of words, or string
// - lerpT: time value for lerp, used for both letter hue lerping
// - wordLerpT: lerping T between words
// - sort: if words is a string, `true` will cause the array to be sorted
palette.hueFromWords = function (words, lerpT, wordLerpT, sort) {
	lerpT = lerpT || .5;
	sort = sort || false;

	if (typeof words === "string") {
		words = wordParser.getWords(words, sort);
	}

	var hue,
		h;

	words.forEach(function (w) {
		h = palette.hueFromString(w, lerpT);

		if (!hue) {
			hue = h;
		} else {
			hue = palette.lerp1d(hue, h, wordLerpT);
		}
	});

	return hue;
};

// ## triad
// Returns an array of 3 colors, using the specified root color.
//
// Params:
//
// - color: a HexColor instance
palette.triad = function (color) {
	return [
		color,
		new HexColor(color.b, color.r, color.g),
		new HexColor(color.g, color.b, color.r)
	];
};

// ## shifted
// Returns an array of colors, using the root color, shifted by an amount.
//
// Params:
//
// - color: HexColor instance
// - count: number of colors to generate
// - shift: how much to offset the hue for each new color
palette.shifted = function (color, count, shift) {
	var hsb = color.toHsbArray(),
		i,
		colors = [color],
		hexColor;

	// shift the hue around the color wheel
	for (i = 0; i < count; i++) {
		hsb[0] = (hsb[0] + shift) % 360;

		hexColor = new HexColor(0,0,0);
		hexColor.updateHsb(hsb);

		colors.push(hexColor);
	}

	return colors;
};

// ## tetrad
// Returns an array of 4 colors, using the specified root color.
//
// Params:
//
// - color: a HexColor instance
palette.tetrad = function (color) {
	return palette.shifted(color, 3, 61);
};

// ## analogous
// Returns an array of analogous colors, using the root color.
//
// Params:
//
// - color: HexColor instance
palette.analogous = function (color) {
	return palette.shifted(color, 3, 20);
};

// ## tree
// Branches out from each color by picking analogous colors.
// See `analogous` for more details.
palette.tree = function (colors, count, shift) {
	var retval = [];

	colors.forEach(function (c) {
		var p = palette.analogous(c, count, shift);
		p.forEach(function (pColor) {
			retval.push(pColor);
		});
	});

	return retval;
};

// ## triadTree
palette.triadTree = function (color, count, shift) {
	count = count || 3;
	shift = shift || 10;

	var triad = palette.triad(color);

	return palette.tree(triad, count, shift);
};

// ## tetradTree
palette.tetradTree = function (color, count, shift) {
	count = count || 3;
	shift = shift || 10;

	var tetrad = palette.tetrad(color);

	return palette.tree(tetrad, count, shift);
};

palette.lerp1d = function (a, b, t) {
	return a + (b * t);
};

module.exports = palette;
