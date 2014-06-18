var assert = require("assert"),
	palette = require("../index.js").palette;

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
