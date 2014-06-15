var config = require("../ini/config.js"),
	HexColor = require("./HexColor.js"),
	wordBlacklist = config.palette.wordBlacklist;

// ## getWords
// Returns an array of words from the specified string,
// optionally sorted in alphabetical order (minus any blacklisted words)
function getWords(str, sort) {
	str = str.toLowerCase();

	var wordsRaw = str.split(" "),
		words = [];

	wordsRaw.forEach(function (w) {
		w = w.trim();
		if (wordBlacklist.indexOf(w) === -1) {
			words.push(w);
		}
	});
	
	if (sort) {
		words.sort();
	}

	return words;
}

// ## hexColorFromWords
// returns a hex color from the specified array of words; will make array if a string
//
// - words: array of words, or string
// - options
//  - lerpT: time value for lerp
//  - sort: if words is a string, `true` will cause the array to be sorted
//  - delegate: formatter function to be called on each color; needs to return the color
function hexColorFromWords(words, options) {
	options = options || {};
	options.delegate = options.delegate || function (hexColor) { return hexColor; };
	options.lerpT = options.lerpT || .5;
	options.sort = options.hasOwnProperty("sort") ? options.sort : false;

	if (typeof words === "string") {
		words = getWords(words, options.sort);
	}

	var color = options.delegate(hexColorFromString(words[0])),
		i;

	// TODO: pull the lerp T out into an option?
	for (i = 1; i < words.length; i++) {
		color.towards(options.delegate(hexColorFromString(words[i])), options.lerpT);
	}

	return color;
}

// ## hexColorFromString
// returns a hex color from the specified string
function hexColorFromString(str) {
	var buffer = new Buffer(str, "utf8"),
		rgb = [],
		hex = "0x",
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
}

module.exports = {
	hexColorFromString: hexColorFromString,
	hexColorFromWords: hexColorFromWords
};
