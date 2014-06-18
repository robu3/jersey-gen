var assert = require("assert"),
	palette = require("../index.js").palette;
	HexColor = require("../index.js").HexColor;

// find() for arrays - can't wait until this is included in node
function find(list, delegate) {
	var found,
		i;

	for (i = 0; i < list.length; i++) {
		if (delegate(list[i])) {
			return found;
		}
	}
}

describe("palette.hexColorFromString()", function () {
	// build test string: "baz"
	// building from buffer for clarity
	var buffer = new Buffer([0x62, 0x61, 0x7A]),
		str = buffer.toString(),
		hexColor = palette.hexColorFromString(str);

	it("should return '#62617a' as the hex color code", function () {
		assert.equal("#62617a", hexColor.toHexCode());
	});

	it("should return [98, 97, 122] as the RGB values", function () {
		var expected = [98, 97, 122],
			rgb = hexColor.toRgbArray();

		assert.equal(3, rgb.length);

		expected.forEach(function (v) {
			assert.notEqual(-1, rgb.indexOf(v));
		});
	});
});

describe("palette.hexColorFromWords()", function () {
	var strA = "dogs eat cows",
		strB = "cows eat dogs",
		colorA = palette.hexColorFromWords(strA, { sort: true }),
		colorB = palette.hexColorFromWords(strB, { sort: true });

	it("should produce the same value if the words are sorted", function () {
		assert.equal(colorA.toHexCode(), colorB.toHexCode());
	});
});

describe("palette.triad()", function () {
	it("should produce a triad of colors", function () {
		var color = new HexColor(255, 0, 255),
			triad = palette.triad(color),
			result;

		result = find(triad, function (c) {
			return c.equalsRgb([255, 0, 255]);
		});
		assert.equal(true, result !== "undefined");

		result = find(triad, function (c) {
			return c.equalsRgb([255, 255, 0]);
		});
		assert.equal(true, result !== "undefined");

		result = find(triad, function (c) {
			return c.equalsRgb([0, 255, 255]);
		});
		assert.equal(true, result !== "undefined");
	});
});

describe("palette.tetrad()", function () {
	it("should produce a tetrad of colors (that's 4!)", function () {
		var color = new HexColor(255, 0, 100),
			tetrad = palette.tetrad(color),
			result;

		result = find(tetrad, function (c) {
			return c.equalsRgb([255, 0, 100]);
		});
		assert.equal(true, result !== "undefined");

		result = find(tetrad, function (c) {
			return c.equalsRgb([100, 255, 100]);
		});
		assert.equal(true, result !== "undefined");

		result = find(tetrad, function (c) {
			return c.equalsRgb([100, 0, 255]);
		});
		assert.equal(true, result !== "undefined");

		result = find(tetrad, function (c) {
			return c.equalsRgb([255, 100, 0]);
		});
		assert.equal(true, result !== "undefined");
	});
});
