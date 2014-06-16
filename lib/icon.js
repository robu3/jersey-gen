var Canvas = require("canvas"),
	wordParser = require("./word-parser.js");

// ## buildBitArray
// Builds an array of bits from a string
function buildBitArray(str) {
	// shifting bits
	var buffer = new Buffer(str, "utf8"),
		bits = [],
		i;

	for (i = 0; i < buffer.length; i++) {
		var bite = buffer[i],
			shifted = bite;

		while (shifted > 0) {
			bits.push(shifted & 1);
			shifted >>>= 1;
		}
	}

	return bits;
}

// ## buildIcon
// Builds an icon in PNG format from an array of bits.
//
// callback params:
//
// - err
// - buffer (PNG data)
function buildIcon(bits, options, cb) {
	// check if options were skipped
	if (typeof options === "function") {
		cb = options;
		options = null;
	}

	// default options
	options = options || {};
	options.bitSize = options.bitSize || 1;
	options.backgroundFill = options.backgroundFill || "gray";
	options.onFill = options.onFill || "black";
	options.offFill = options.offFill || "white";

	// make it square
	var width = Math.ceil(Math.sqrt(bits.length)),
		height = Math.ceil(bits.length / width);

	// total size specified
	// overrides bitSize
	if (options.width) {
		options.bitSize = Math.round(options.width / width);
	}

	var canvas = new Canvas(
			width * options.bitSize,
			height * options.bitSize
		),
		ctx = canvas.getContext("2d"),
		i;

	// background color
	ctx.fillStyle = options.backgroundFill;
	ctx.fillRect(0, 0, width * options.bitSize, height * options.bitSize);

	for (i = 0; i < bits.length; i++) {
		if (bits[i] === 1) {
			ctx.fillStyle = options.onFill;
		} else {
			ctx.fillStyle = options.offFill;
		}

		ctx.fillRect(
			(i % width) * options.bitSize,
			Math.floor(i / width) * options.bitSize,
			options.bitSize,
			options.bitSize
		);
	}

	canvas.toBuffer(cb);
}

// ## buildIconFromString
// Builds an icon from a word string
//
// options:
// - wordMode: builds the icon by parsing words from `str`
// - sort: sorts words if `wordMode` == true
function buildIconFromString(str, options, cb) {
	if (options.wordMode) {
		str = wordParser.getWords(str, options.sort).join(",");
	}
	
	var bits = buildBitArray(str);
	buildIcon(bits, options, cb);
}

module.exports = {
	buildBitArray: buildBitArray,
	buildIcon: buildIcon,
	buildIconFromString: buildIconFromString
};
